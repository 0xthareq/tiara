import { Router } from "express";
import { config, isDemoMode, SHEET_NAMES } from "../config.js";
import { getSheetRows } from "../sheetsClient.js";
import {
  aggregateTracerStudy,
  aggregateKarir,
  aggregatePrestasi,
  aggregateKegiatan,
} from "../aggregations.js";

export const router = Router();

const respond = (res, data) => {
  res.json({ meta: { demoMode: isDemoMode(), generatedAt: new Date().toISOString() }, data });
};

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data dari Google Sheets.", detail: err.message });
  }
};

router.get("/health", (req, res) => {
  res.json({ status: "ok", demoMode: isDemoMode() });
});

router.get(
  "/tracer-study",
  handle(async (req, res) => {
    const rows = await getSheetRows(SHEET_NAMES.tracerStudy);
    respond(res, aggregateTracerStudy(rows, config.targets));
  })
);

router.get(
  "/karir",
  handle(async (req, res) => {
    const rows = await getSheetRows(SHEET_NAMES.karir);
    respond(res, aggregateKarir(rows, config.targets));
  })
);

router.get(
  "/prestasi",
  handle(async (req, res) => {
    const rows = await getSheetRows(SHEET_NAMES.prestasi);
    respond(res, aggregatePrestasi(rows));
  })
);

router.get(
  "/kegiatan",
  handle(async (req, res) => {
    const rows = await getSheetRows(SHEET_NAMES.kegiatan);
    respond(res, aggregateKegiatan(rows));
  })
);

router.get(
  "/overview",
  handle(async (req, res) => {
    const [tracerRows, karirRows, prestasiRows, kegiatanRows] = await Promise.all([
      getSheetRows(SHEET_NAMES.tracerStudy),
      getSheetRows(SHEET_NAMES.karir),
      getSheetRows(SHEET_NAMES.prestasi),
      getSheetRows(SHEET_NAMES.kegiatan),
    ]);

    const tracerStudy = aggregateTracerStudy(tracerRows, config.targets);
    const karir = aggregateKarir(karirRows, config.targets);
    const prestasi = aggregatePrestasi(prestasiRows);
    const kegiatan = aggregateKegiatan(kegiatanRows);

    const tepatWaktuRataRata =
      tracerStudy.summary.reduce((sum, s) => sum + s.pct, 0) / (tracerStudy.summary.length || 1);

    respond(res, {
      totalAlumniTerdata: tracerRows.length,
      tepatWaktuRataRata: Math.round(tepatWaktuRataRata * 10) / 10,
      pctIku1: karir.summary.pctIku1,
      totalPrestasi: prestasi.summary.total,
      totalKegiatanLuarKampus: kegiatan.summary.total,
      totalPertukaranMahasiswa: kegiatan.summary.totalPertukaran,
      tracerStudySummary: tracerStudy.summary,
      statusCounts: karir.statusCounts,
      byTingkatPrestasi: prestasi.byTingkat,
    });
  })
);
