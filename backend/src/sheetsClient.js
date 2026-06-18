import { google } from "googleapis";
import { config, isDemoMode } from "./config.js";
import { MOCK_ROWS } from "./mockData.js";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];

let authClientPromise = null;

function getAuthClient() {
  if (authClientPromise) return authClientPromise;

  if (config.googleServiceAccountJson) {
    // Cara A: JSON service account ditempel langsung sebagai env var.
    const credentials = JSON.parse(config.googleServiceAccountJson);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    authClientPromise = auth.getClient();
  } else {
    // Cara B: mengandalkan GOOGLE_APPLICATION_CREDENTIALS (path file JSON),
    // dibaca otomatis oleh Application Default Credentials milik Google.
    const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
    authClientPromise = auth.getClient();
  }
  return authClientPromise;
}

// Cache sederhana di memori supaya tidak memanggil Sheets API
// setiap kali ada request masuk (Sheets API punya rate limit).
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function rowsToObjects(values) {
  if (!values || values.length === 0) return [];
  const [headerRow, ...dataRows] = values;
  const headers = headerRow.map((h) => String(h || "").trim());
  return dataRows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] !== undefined ? String(row[i]).trim() : "";
      });
      return obj;
    });
}

/**
 * Mengambil seluruh baris dari satu tab/sheet sebagai array of objects,
 * dengan baris pertama dijadikan nama kolom (header).
 * Otomatis memakai data contoh apabila aplikasi berjalan dalam mode demo.
 */
export async function getSheetRows(sheetName) {
  if (isDemoMode()) {
    return MOCK_ROWS[sheetName] || [];
  }

  const cached = cache.get(sheetName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${sheetName}!A1:Z2000`,
  });

  const rows = rowsToObjects(response.data.values || []);
  cache.set(sheetName, { data: rows, timestamp: Date.now() });
  return rows;
}

export function clearSheetCache() {
  cache.clear();
}
