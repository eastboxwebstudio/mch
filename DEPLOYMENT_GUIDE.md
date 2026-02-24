# Deployment Guide: Cloudflare Pages & Google Sheets

## 1. GitHub Setup
1. Create a new repository on GitHub.
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## 2. Cloudflare Pages Deployment
1. Log in to the Cloudflare Dashboard > **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository.
4. **Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Save and Deploy**.

## 3. Google Sheets Database Setup (Free, No Third-Party)
To use Google Sheets as a database without a third-party bridge, we will use **Google Apps Script**. This allows your Google Sheet to act as a free API.

### Step 1: Prepare the Google Sheet
1. Create a new Google Sheet.
2. Create three tabs (sheets) exactly named: `profiles`, `employment_records`, and `contact_requests`.
3. Add headers to the first row of each sheet:
   - **`profiles`**: `id`, `role`, `full_name`, `email`, `rank`, `coc`, `ic_passport`, `sid`, `phone`, `nationality`, `years_of_experience`, `ship_type_experience`, `cert_basic_training_expiry`, `cert_adv_fire_fighting_expiry`, `cert_survival_craft_expiry`, `availability_status`, `employment_status`, `last_sign_off_date`
   - **`employment_records`**: `id`, `seafarer_id`, `event_type`, `vessel_name`, `event_date`, `port`, `source`, `verification_status`, `created_at`
   - **`contact_requests`**: `id`, `requester_id`, `seafarer_id`, `status`, `created_at`, `requester_name`, `seafarer_name`, `admin_reviewed_at`

### Step 2: Add the Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Delete any code there and paste the following code:

```javascript
function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    const action = method === 'GET' ? e.parameter.action : JSON.parse(e.postData.contents).action;
    const payload = method === 'GET' ? e.parameter : JSON.parse(e.postData.contents).payload;
    
    let result = null;
    
    if (action === 'getProfiles') result = getSheetData('profiles', payload);
    else if (action === 'getEmploymentRecords') result = getSheetData('employment_records', payload);
    else if (action === 'getContactRequests') result = getSheetData('contact_requests', payload);
    else if (action === 'updateProfile') result = updateRow('profiles', payload);
    else if (action === 'createEmploymentRecord') result = createRow('employment_records', payload);
    else if (action === 'updateEmploymentRecord') result = updateRow('employment_records', payload);
    else throw new Error("Unknown action: " + action);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(sheetName, filters) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  let result = rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
  
  // Basic filtering
  if (filters) {
    Object.keys(filters).forEach(key => {
      if (key !== 'action' && filters[key]) {
        result = result.filter(row => row[key] == filters[key]);
      }
    });
  }
  return result;
}

function createRow(sheetName, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getDataRange().getValues()[0];
  
  const newRow = headers.map(header => payload[header] || '');
  sheet.appendRow(newRow);
  return payload;
}

function updateRow(sheetName, payload) {
  if (!payload.id) throw new Error("ID required for update");
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const idIndex = headers.indexOf('id');
  const rowIndex = data.findIndex((row, i) => i > 0 && row[idIndex] == payload.id);
  
  if (rowIndex === -1) throw new Error("Record not found");
  
  const actualRowNumber = rowIndex + 1; // 1-based index
  
  Object.keys(payload).forEach(key => {
    const colIndex = headers.indexOf(key);
    if (colIndex !== -1 && key !== 'id') {
      sheet.getRange(actualRowNumber, colIndex + 1).setValue(payload[key]);
    }
  });
  
  return payload;
}
```

### Step 3: Deploy the API
1. In the Apps Script editor, click **Deploy > New deployment**.
2. Select type: **Web app**.
3. Description: `v1` (or anything).
4. Execute as: **Me** (your email).
5. Who has access: **Anyone** (this is required for your frontend to read it without forcing users to log in to Google).
6. Click **Deploy**.
7. **Authorize Access** if prompted.
8. Copy the **Web app URL** (it ends in `/exec`).

### Step 4: Connect to Cloudflare Pages
1. In Cloudflare Pages > **Settings** > **Environment Variables**:
   - Add `VITE_APPS_SCRIPT_URL` = `[Paste your Web app URL here]`
   - Add `VITE_USE_GOOGLE_SHEETS` = `true`
2. Redeploy your site.


