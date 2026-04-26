/**
 * WMS Master - Google Sheets Backend
 * Handles GET and POST requests from the Frontend
 * 
 * Includes CORS support for Vercel and strict JSON responses.
 */

/**
 * ฟังก์ชันสำหรับตั้งค่า Sheet และหัวตารางเบื้องต้น (รันแค่ครั้งเดียวตอนเริ่มโปรเจกต์)
 * ไปที่เมนู Run > setupDatabase
 */

const GLOBAL_SHEETS_CONFIG = {
    'ItemMaster': ['ItemCode', 'ItemName', 'Type', 'Category', 'SubCategory', 'Unit', 'Cost', 'Price'],
    'MasterCodes': ['id', 'mastCode', 'groups', 'category', 'catCode', 'subCategory', 'subCatCode', 'note', 'updatedAt', 'updatedBy'],
    'JobOrders': ['id', 'joNo', 'productName', 'sku', 'qty', 'received', 'status', 'currentStage', 'startDate', 'dueDate', 'priority', 'customerName', 'soRef', 'history'],
    'ProductionLogs': ['id', 'joId', 'joNo', 'stage', 'action', 'operator', 'timestamp', 'qtyCompleted', 'notes'],
    'WarehouseIn Logs': ['id', 'transId', 'date', 'joNo', 'sku', 'productName', 'qty', 'status', 'warehouseName', 'location', 'operator'],
    'WarehouseOutLogs': ['id', 'transId', 'date', 'outType', 'sku', 'productName', 'qty', 'operator', 'warehouseName', 'location', 'notes'],
    'Users': ['id', 'employeeId', 'idCard', 'name', 'role', 'avatar'],
    'AppUsers': ['id', 'employeeId', 'name', 'role', 'permissions', 'position', 'email', 'avatar', 'isDev'],
    'ConfidentialityMap': ['id', 'moduleId', 'isConfidential'],
    'DeliveryOrders': ['id', 'soNo', 'refId', 'customer', 'sku', 'productName', 'qty', 'shipped', 'date', 'status', 'location'],
    'MrpOrders': ['id', 'moNo', 'date', 'fgSku', 'fgName', 'rmSku', 'rmName', 'qty', 'issued', 'status'],
    'HistoryLogs': ['id', 'transId', 'date', 'type', 'sku', 'productName', 'qty', 'operator', 'location', 'notes'],
    'PurchaseOrders': ['id', 'poNo', 'supplierId', 'date', 'status', 'totalAmount', 'expectedDate', 'items', 'priority'],
    'ProductCost': ['id', 'itemId', 'item', 'itemName', 'category', 'targetMargin', 'batchSize', 'dm', 'dl', 'factory_oh', 'office_oh', 'utilities', 'depreciation', 'selling', 'admin', 'others', 'history', 'productCost', 'periodCost', 'totalCost', 'suggestedPrice', 'status'],
    'Items': ['id', 'itemCode', 'itemName', 'itemType', 'category', 'subCategory', 'baseUnit', 'stdCost', 'stdPrice', 'leadTime', 'moq', 'status'],
    'Suppliers': ['id', 'code', 'name', 'contactName', 'phone', 'email', 'address', 'paymentTerms', 'status'],
    'Customers': ['id', 'code', 'name', 'contactName', 'phone', 'email', 'address', 'creditLimit', 'status'],
    'Settings': ['id', 'key', 'value', 'description', 'updatedAt'],
    'Invoices': ['id', 'invoiceNo', 'customerId', 'date', 'dueDate', 'totalAmount', 'status', 'paidAmount', 'items']
};

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetsConfig = GLOBAL_SHEETS_CONFIG;

  for (let name in sheetsConfig) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    // ตั้งค่าหัวตาราง (Headers)
    const headers = sheetsConfig[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setBackground("#e8ecef")
      .setFontColor("black");
    
    // Freeze แถวแรก
    sheet.setFrozenRows(1);
    
    // Auto-resize คอลัมน์
    sheet.autoResizeColumns(1, headers.length);
  }

  // สร้าง User ตัวอย่างสำหรับ Admin (ถ้ายังไม่มี)
  const userSheet = ss.getSheetByName("Users");
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow(['1', 'ADMIN001', '1234', 'System Admin', 'Admin', '']);
  }

  Logger.log("Database Setup Complete!");
}

function doOptions(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return ContentService.createTextOutput('').setHeaders(headers);
}

function doPost(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  const lock = LockService.getScriptLock();
  try {
    // Wait for up to 30 seconds for other processes to finish
    // This is crucial for handling multiple users hitting the endpoint simultaneously
    if (!lock.tryLock(30000)) {
      throw new Error("Lock timeout: Server is busy, please try again.");
    }
    
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheetName = params.sheet;
    const data = params.data;
    const apiKey = params.apiKey;
    
    // Basic Security: Check API Key
    const EXPECTED_API_KEY = "your_secret_key_here"; 
    // const EXPECTED_API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
    
    if (apiKey !== EXPECTED_API_KEY && action !== 'login') {
      // return createResponse("error", "Unauthorized: Invalid API Key", null, headers);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Auto-Provisioning: Create sheet and headers if they don't exist
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet && sheetName) {
      sheet = ss.insertSheet(sheetName);
      let columns = GLOBAL_SHEETS_CONFIG[sheetName];
      
      if (!columns) {
        if (data && Array.isArray(data) && data.length > 0) {
          columns = Object.keys(data[0]);
        } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          columns = Object.keys(data);
        }
      }

      if (columns && columns.length > 0) {
        sheet.getRange(1, 1, 1, columns.length).setValues([columns])
          .setFontWeight("bold")
          .setBackground("#e8ecef")
          .setFontColor("black");
      }
    }
    
    if (!sheet && action !== 'login') {
      return createResponse("error", "Sheet not found and could not be created: " + sheetName, null, headers);
    }

    switch (action) {
      case 'read':
        return readData(sheet, params, headers);
      case 'write':
        return writeData(sheet, data, headers);
      case 'lookup':
        return lookupData(sheet, params, headers); // Pass full params for search type customization
      case 'update':
        return updateData(sheet, data, headers);
      case 'delete':
        return deleteData(sheet, data, headers);
      case 'login':
        return handleLogin(ss, data, headers);
      default:
        return createResponse("error", "Unknown action: " + action, null, headers);
    }
  } catch (err) {
    return createResponse("error", err.toString(), null, headers);
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}

function doGet(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return createResponse("success", "WMS Master API is active. Please use POST for data operations.", null, headers);
}

// --- Action Handlers ---

function readData(sheet, params, headersObj) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return createResponse("success", "Data retrieved", { items: [], totalCount: 0, limit: params.limit || null, offset: params.offset || 0 }, headersObj);
  }

  const columns = values[0];
  let data = values.slice(1).map(row => {
    const obj = {};
    columns.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  // Support Pagination
  const limit = params.limit || null;
  const offset = params.offset || 0;
  
  const totalCount = data.length;
  if (limit !== null) {
    data = data.slice(offset, offset + limit);
  }

  return createResponse("success", "Data retrieved", {
    items: data,
    totalCount: totalCount,
    limit: limit,
    offset: offset
  }, headersObj);
}

function writeData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  var sheetHeaders = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  if (!sheetHeaders || sheetHeaders.length === 0 || sheetHeaders[0] === "") {
    if (data.length > 0) {
      sheetHeaders = Object.keys(data[0]);
      sheet.getRange(1, 1, 1, sheetHeaders.length).setValues([sheetHeaders])
        .setFontWeight("bold")
        .setBackground("#e8ecef")
        .setFontColor("black");
    } else {
      return createResponse("error", "No data to write and no headers exist", null, headersObj);
    }
  }
  
  data.forEach(item => {
    const row = sheetHeaders.map(h => item[h] || "");
    sheet.appendRow(row);
  });
  
  // Auto-Cleanup: Remove empty rows to keep the sheet lean and fast
  const lastRow = sheet.getLastRow();
  const maxRows = sheet.getMaxRows();
  if (maxRows > lastRow + 1) {
    sheet.deleteRows(lastRow + 1, maxRows - lastRow - 1);
  }
  
  return createResponse("success", "Data saved successfully", null, headersObj);
}

function updateData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  if (data.length === 0) return createResponse("error", "No data provided for update", null, headersObj);

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return createResponse("error", "'id' column not found for update", null, headersObj);

  let updatedCount = 0;
  data.forEach(updateItem => {
    const targetId = String(updateItem.id);
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idIndex]) === targetId) {
        // Update cells in this row
        headers.forEach((header, colIdx) => {
          if (updateItem.hasOwnProperty(header)) {
            sheet.getRange(i + 1, colIdx + 1).setValue(updateItem[header]);
          }
        });
        updatedCount++;
        break;
      }
    }
  });

  return createResponse("success", `Updated ${updatedCount} rows`, null, headersObj);
}

function deleteData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  if (data.length === 0) return createResponse("error", "No data provided for delete", null, headersObj);

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return createResponse("error", "'id' column not found for delete", null, headersObj);

  const idsToDelete = data.map(item => String(item.id));
  let deletedCount = 0;

  // Iterate backwards to avoid index shifting problems
  for (let i = values.length - 1; i >= 1; i--) {
    if (idsToDelete.includes(String(values[i][idIndex]))) {
      sheet.deleteRow(i + 1);
      deletedCount++;
    }
  }

  return createResponse("success", `Deleted ${deletedCount} rows`, null, headersObj);
}

function lookupData(sheet, params, headersObj) {
  const dataList = params.data;
  const matchType = params.matchType || 'exact'; // 'exact' หรือ 'includes'
  
  if (!dataList || dataList.length === 0) return createResponse("error", "Lookup requires 'data' array containing search object", null, headersObj);
  var criteria = dataList[0]; 
  var criteriaKeys = Object.keys(criteria);
  
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return createResponse("success", "No data found", { items: [] }, headersObj);
  var sheetHeaders = rows[0];
  var result = [];
  
  for (var i = 1; i < rows.length; i++) {
      var match = true;
      for (var c = 0; c < criteriaKeys.length; c++) {
          var key = criteriaKeys[c];
          var colIndex = sheetHeaders.indexOf(key);
          
          if (colIndex === -1) {
             match = false;
             break;
          }

          var rowValue = rows[i][colIndex].toString().toLowerCase();
          var criteriaValue = criteria[key].toString().toLowerCase();

          if (matchType === 'includes') {
             if (!rowValue.includes(criteriaValue)) {
                 match = false;
                 break;
             }
          } else {  // 'exact'
             if (rowValue !== criteriaValue) {
                 match = false;
                 break;
             }
          }
      }
      
      if (match) {
          var obj = {};
          for (var j = 0; j < sheetHeaders.length; j++) {
              obj[sheetHeaders[j]] = rows[i][j];
          }
          result.push(obj);
      }
  }

  // Pagination on Lookup
  const limit = params.limit || null;
  const offset = params.offset || 0;
  let finalData = result;
  if (limit !== null) {
      finalData = result.slice(offset, offset + limit);
  }

  return createResponse("success", "Lookup successful", { 
      items: finalData,
      totalCount: result.length,
      limit: limit,
      offset: offset 
  }, headersObj);
}

function handleLogin(ss, credentials, headersObj) {
  const userSheet = ss.getSheetByName("Users");
  if (!userSheet) return createResponse("error", "Users sheet not found", null, headersObj);

  const values = userSheet.getDataRange().getValues();
  if (values.length <= 1) return createResponse("error", "No users found", null, headersObj);

  const columns = values[0];
  const users = values.slice(1).map(row => {
    const obj = {};
    columns.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  const user = users.find(u => 
    String(u.employeeId) === String(credentials.employeeId) && 
    String(u.idCard) === String(credentials.idCard)
  );

  if (user) {
    // Format response to match App's User interface
    const userData = {
      id: user.id || user.employeeId,
      employeeId: user.employeeId,
      name: user.name,
      role: user.role,
      avatar: user.avatar || "",
      permissions: {
        canCreate: user.role === 'Admin' || user.role === 'Editor',
        canEdit: user.role === 'Admin' || user.role === 'Editor',
        canApprove: user.role === 'Admin',
        canVerify: user.role === 'Admin' || user.role === 'Editor'
      }
    };
    return createResponse("success", "Login successful", userData, headersObj);
  } else {
    return createResponse("error", "Invalid Staff Code or ID Card Number", null, headersObj);
  }
}

// --- Helpers ---

function createResponse(status, message, data, headers) {
  const result = { status: status, message: message, data: data };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers || {});
}
