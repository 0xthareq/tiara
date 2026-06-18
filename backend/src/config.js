import "dotenv/config";

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 4000),
  spreadsheetId: process.env.SPREADSHEET_ID || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",

  targets: {
    tepatWaktuS1: num(process.env.TARGET_TEPAT_WAKTU_S1, 80),
    tepatWaktuS2: num(process.env.TARGET_TEPAT_WAKTU_S2, 80),
    masaTungguBulan: num(process.env.TARGET_MASA_TUNGGU_BULAN, 6),
    rasioGajiUmr: num(process.env.TARGET_RASIO_GAJI_UMR, 1.2),
  },
};

// Server berjalan dalam mode demo (data contoh) bila spreadsheet ID
// belum diisi, atau belum ada kredensial Google sama sekali.
export const isDemoMode = () => {
  const hasCredentials =
    Boolean(config.googleServiceAccountJson) ||
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  return !config.spreadsheetId || !hasCredentials;
};

// Nama tab (sheet) di dalam spreadsheet. Sesuaikan di sini jika
// nama tab pada Google Sheet kamu berbeda.
export const SHEET_NAMES = {
  tracerStudy: "TracerStudy_Kelulusan",
  karir: "TracerStudy_Karir",
  prestasi: "PrestasiMahasiswa",
  kegiatan: "KegiatanLuarKampus",
};
