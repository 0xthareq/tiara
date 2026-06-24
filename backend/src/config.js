import "dotenv/config";

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Empat spreadsheet terpisah:
  // - tracerStudy : Form Tracer Study Alumni
  // - prestasi    : Form Prestasi & Kegiatan Luar Kampus
  // - beasiswa    : Form Pendataan Beasiswa Mahasiswa Aktif
  // - lulusan     : Database Lulusan FMIPA (multi-tab, 1 tab per tahun ajar)
  spreadsheetIds: {
    tracerStudy: process.env.SPREADSHEET_ID_TRACER   || "",
    prestasi:    process.env.SPREADSHEET_ID_PRESTASI || "",
    beasiswa:    process.env.SPREADSHEET_ID_BEASISWA || "",
    lulusan:     process.env.SPREADSHEET_ID_LULUSAN  || "",
  },

  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",

  targets: {
    tepatWaktuS1:    num(process.env.TARGET_TEPAT_WAKTU_S1,    80),
    tepatWaktuS2:    num(process.env.TARGET_TEPAT_WAKTU_S2,    80),
    masaTungguBulan: num(process.env.TARGET_MASA_TUNGGU_BULAN,  6),
    rasioGajiUmr:    num(process.env.TARGET_RASIO_GAJI_UMR,   1.2),
  },
};

// Mode demo aktif bila tracerStudy / prestasi belum dikonfigurasi,
// atau belum ada kredensial Google.
// beasiswa & lulusan sengaja tidak di-require agar tidak memaksa
// demo mode jika spreadsheet baru belum disiapkan.
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

export const SHEET_NAMES = {
  tracerStudy: { spreadsheetKey: "tracerStudy", tab: "TracerStudy_Kelulusan" },
  karir:       { spreadsheetKey: "tracerStudy", tab: "TracerStudy_Karir"     },
  prestasi:    { spreadsheetKey: "prestasi",    tab: "PrestasiMahasiswa"     },
  kegiatan:    { spreadsheetKey: "prestasi",    tab: "KegiatanLuarKampus"    },
  beasiswa:    { spreadsheetKey: "beasiswa",    tab: "Form Responses 1"      },
  // Lulusan tidak pakai SHEET_NAMES karena dibaca via getLulusanData()
  // yang otomatis membaca semua tab dari spreadsheet.
};
