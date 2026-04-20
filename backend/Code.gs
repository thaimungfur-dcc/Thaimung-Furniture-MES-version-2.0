/**
 * WMS Master - Google Sheets Backend
 * Handles GET and POST requests from the Frontend
 * 
 * Includes CORS support for Vercel and strict JSON responses.
 */

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
      if (data && Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]);
        sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
      } else if (data && typeof data === 'object') {
        const columns = Object.keys(data);
        sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
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
    sheetHeaders = Object.keys(data[0]);
    sheet.getRange(1, 1, 1, sheetHeaders.length).setValues([sheetHeaders]);
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
