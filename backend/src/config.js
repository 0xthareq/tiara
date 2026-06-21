import "dotenv/config";

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Dua spreadsheet terpisah: satu untuk Form Tracer Study Alumni,
  // satu untuk Form Prestasi & Kegiatan Luar Kampus.
  spreadsheetIds: {
    tracerStudy: process.env.SPREADSHEET_ID_TRACER || "",
    prestasi: process.env.SPREADSHEET_ID_PRESTASI || "",
  },

  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",

  targets: {
    tepatWaktuS1: num(process.env.TARGET_TEPAT_WAKTU_S1, 80),
    tepatWaktuS2: num(process.env.TARGET_TEPAT_WAKTU_S2, 80),
    masaTungguBulan: num(process.env.TARGET_MASA_TUNGGU_BULAN, 6),
    rasioGajiUmr: num(process.env.TARGET_RASIO_GAJI_UMR, 1.2),
  },
};

// Server berjalan dalam mode demo (data contoh) bila salah satu
// spreadsheet ID belum diisi, atau belum ada kredensial Google sama sekali.
export const isDemoMode = () => {
  const hasCredentials =
    Boolean(config.googleServiceAccountJson) ||
    Boolean(
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
        process.env.GOOGLE_APPLICATION_CREDENTIALS !== "./service-account.json"
    );
  const hasSpreadsheets =
    Boolean(config.spreadsheetIds.tracerStudy) &&
    Boolean(config.spreadsheetIds.prestasi);
  return !hasSpreadsheets || !hasCredentials;
};

// Setiap entri menyatakan: data ini ada di spreadsheet mana (tracerStudy /
// prestasi), dan nama tab apa di dalamnya. Sesuaikan `tab` di sini jika
// nama tab pada Google Sheet kamu berbeda.
export const SHEET_NAMES = {
  tracerStudy: { spreadsheetKey: "tracerStudy", tab: "TracerStudy_Kelulusan" },
  karir:       { spreadsheetKey: "tracerStudy", tab: "TracerStudy_Karir" },
  prestasi:    { spreadsheetKey: "prestasi",    tab: "PrestasiMahasiswa" },
  kegiatan:    { spreadsheetKey: "prestasi",    tab: "KegiatanLuarKampus" },
};
