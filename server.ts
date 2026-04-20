import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// --- Google OAuth Setup ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`
);

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];

// --- Auth Routes ---
app.get("/api/auth/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
  res.json({ url });
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    res.cookie("google_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/auth/me", async (req, res) => {
  const tokensStr = req.cookies.google_tokens;
  if (!tokensStr) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    res.json(userInfo.data);
  } catch (error) {
    res.status(401).json({ error: "Invalid tokens" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("google_tokens");
  res.json({ success: true });
});

// --- Google Sheets Logic ---
const SHEET_CONFIG = {
  spreadsheetName: "ERP_System_Data",
  sheets: [
    { name: "Items", headers: ["id", "itemCode", "itemName", "itemType", "category", "subCategory", "baseUnit", "stdCost", "stdPrice", "leadTime", "moq", "status", "updatedAt"] },
    { name: "Suppliers", headers: ["id", "supplierID", "supplierName", "category", "subCategory", "contactName", "phone", "creditTerm", "status", "rating", "taxID", "vendorAddress", "email"] },
    { name: "Customers", headers: ["id", "customerID", "customerName", "category", "subCategory", "contactName", "phone", "creditTerm", "status", "rating", "taxID", "billingAddress", "shippingAddress"] },
    { name: "WarehouseIn", headers: ["id", "date", "qty", "location", "warehouseName", "lotNo", "remark", "refNo", "itemName", "inType"] },
    { name: "WarehouseOut", headers: ["id", "date", "qty", "location", "warehouseName", "lotNo", "remark", "refNo", "itemName", "outType"] },
    { name: "ProductCost", headers: ["id", "itemId", "item", "itemName", "category", "productCost", "periodCost", "totalCost", "suggestedPrice", "status", "batchSize", "targetMargin", "dm", "dl", "factory_oh", "office_oh", "utilities", "depreciation", "selling", "admin", "others", "history"] },
    { name: "JobOrders", headers: ["id", "joNo", "soRef", "sku", "productName", "qty", "received", "dueDate", "status"] },
    { name: "PurchaseOrders", headers: ["id", "poNo", "supplier", "sku", "itemName", "qty", "received", "date", "status"] },
    { name: "HistoryLogs", headers: ["id", "transId", "receiveFrom", "refNo", "date", "sku", "itemName", "qty", "unit", "location", "warehouseName", "lotNo", "mfgDate", "expDate", "remark", "status", "by"] },
    { name: "DeliveryOrders", headers: ["id", "soNo", "customer", "sku", "productName", "qty", "delivered", "date", "status"] },
    { name: "MrpOrders", headers: ["id", "moNo", "fgSku", "rmSku", "rmName", "qty", "delivered", "date", "status"] },
    { name: "WarehouseOutLogs", headers: ["id", "transId", "date", "outType", "refNo", "sku", "itemName", "qty", "location", "warehouseName", "lotNo", "status", "by"] },
    { name: "Settings", headers: ["id", "category", "name", "code"] },
    { name: "MasterCodes", headers: ["id", "mastCode", "groups", "category", "catCode", "subCategory", "subCatCode", "note", "updatedAt", "updatedBy"] },
    { name: "AppUsers", headers: ["id", "name", "position", "email", "avatar", "isDev", "permissions"] },
    { name: "ConfidentialityMap", headers: ["id", "moduleId", "isConfidential"] }
  ]
};

async function getSheetsClient(req: any) {
  const tokensStr = req.cookies.google_tokens;
  if (!tokensStr) throw new Error("Not authenticated");
  const tokens = JSON.parse(tokensStr);
  oauth2Client.setCredentials(tokens);
  return google.sheets({ version: "v4", auth: oauth2Client });
}

async function getDriveClient(req: any) {
  const tokensStr = req.cookies.google_tokens;
  if (!tokensStr) throw new Error("Not authenticated");
  const tokens = JSON.parse(tokensStr);
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: "v3", auth: oauth2Client });
}

async function ensureSpreadsheet(req: any) {
  const drive = await getDriveClient(req);
  const sheets = await getSheetsClient(req);
  
  // Search for existing spreadsheet
  const response = await drive.files.list({
    q: `name = '${SHEET_CONFIG.spreadsheetName}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
    fields: "files(id, name)"
  });
  
  let spreadsheetId = response.data.files?.[0]?.id;
  
  if (!spreadsheetId) {
    // Create new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: SHEET_CONFIG.spreadsheetName }
      }
    });
    spreadsheetId = createResponse.data.spreadsheetId!;
    
    // Create sheets and headers
    for (const sheetDef of SHEET_CONFIG.sheets) {
      // The first sheet is created by default, so we might need to rename it or add others
      if (sheetDef.name !== "Sheet1") {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetDef.name } } }]
          }
        });
      } else {
        // Rename default sheet if needed, but we prefer explicit names
      }
    }
    
    // Remove default "Sheet1" if it's not in our config
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet1 = spreadsheet.data.sheets?.find(s => s.properties?.title === "Sheet1");
    if (sheet1) {
      // Rename Sheet1 to the first sheet in our config
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ updateSheetProperties: { properties: { sheetId: sheet1.properties?.sheetId, title: SHEET_CONFIG.sheets[0].name }, fields: "title" } }]
        }
      });
    }

    // Add headers to all sheets
    for (const sheetDef of SHEET_CONFIG.sheets) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetDef.name}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [sheetDef.headers] }
      });
    }
  } else {
    // Spreadsheet exists, ensure all sheets and headers exist
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    for (const sheetDef of SHEET_CONFIG.sheets) {
      if (!existingSheets.includes(sheetDef.name)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetDef.name } } }]
          }
        });
        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetDef.name}!A1`,
          valueInputOption: "RAW",
          requestBody: { values: [sheetDef.headers] }
        });
      }
    }
  }
  
  return spreadsheetId;
}

// --- Data API Routes ---
app.get("/api/data/:sheetName", async (req, res) => {
  try {
    const { sheetName } = req.params;
    const spreadsheetId = await ensureSpreadsheet(req);
    const sheets = await getSheetsClient(req);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`
    });
    
    const rows = response.data.values;
    if (!rows || rows.length <= 1) return res.json([]);
    
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/data/:sheetName", async (req, res) => {
  try {
    const { sheetName } = req.params;
    const item = req.body;
    const spreadsheetId = await ensureSpreadsheet(req);
    const sheets = await getSheetsClient(req);
    
    const sheetDef = SHEET_CONFIG.sheets.find(s => s.name === sheetName);
    if (!sheetDef) return res.status(400).json({ error: "Invalid sheet name" });
    
    const row = sheetDef.headers.map(header => item[header] || "");
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [row] }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/data/:sheetName/:id", async (req, res) => {
  try {
    const { sheetName, id } = req.params;
    const updatedItem = req.body;
    const spreadsheetId = await ensureSpreadsheet(req);
    const sheets = await getSheetsClient(req);
    
    const sheetDef = SHEET_CONFIG.sheets.find(s => s.name === sheetName);
    if (!sheetDef) return res.status(400).json({ error: "Invalid sheet name" });
    
    // Find the row index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`
    });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);
    
    if (rowIndex === -1) return res.status(404).json({ error: "Item not found" });
    
    const row = sheetDef.headers.map(header => updatedItem[header] || "");
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [row] }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/data/:sheetName/:id", async (req, res) => {
  try {
    const { sheetName, id } = req.params;
    const spreadsheetId = await ensureSpreadsheet(req);
    const sheets = await getSheetsClient(req);
    
    // Find the row index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`
    });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);
    
    if (rowIndex === -1) return res.status(404).json({ error: "Item not found" });
    
    // Get sheetId
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName);
    const sheetId = sheet?.properties?.sheetId;
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            }
          }
        }]
      }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
