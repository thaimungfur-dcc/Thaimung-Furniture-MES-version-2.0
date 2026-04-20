# Google Apps Script Setup & Best Practices

## Code.gs (Backend)
This repository includes a `backend/Code.gs` file which acts as our database and backend handler for Google Sheets. 

It implements several Best Practices:
1. **Auto-Provisioning**: Automatically creates sheets and sets headers when data is written.
2. **Auto-Cleanup**: Automatically cleans up unused rows below the data to keep the sheet lean and fast.
3. **Lock Service**: Uses `LockService` to handle concurrency and prevent race conditions when multiple users edit simultaneously.
4. **CORS Support**: Safely designed to accept cross-origin requests from Vercel deployments.
5. **Standardized JSON API**: 
   - Requests: `{ "action": "read"|"write"|"lookup", "sheet": "SheetName", "data": [...] }`
   - Responses: `{ "status": "success", "message": "...", "data": {...} }`

## Deployment Steps
1. Open Google Sheets -> Extensions -> Apps Script.
2. Copy the contents of `backend/Code.gs` into the script editor.
3. Replace `EXPECTED_API_KEY` with your actual secret key (optional for basic setups).
4. Click **Deploy** -> **New deployment**.
5. Select type: **Web app**.
6. Set "Who has access" to **Anyone**.
7. Copy the resulting **Web App URL**.
8. In Vercel, set the environment variable `VITE_APPS_SCRIPT_URL` to this Web App URL.

## Future-proofing & Scalability
If your app outgrows Google Sheets:
- Simply update `src/services/googleSheets.ts` to point to a new Node.js/Firebase backend.
- Since we use a consistent JSON format across the app, replacing Google Sheets with a real database (PostgreSQL/MongoDB) is seamless and requires almost no UI changes.
