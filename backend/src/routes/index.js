import { Router } from "express";
import { config, isDemoMode } from "../config.js";
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
    const rows = await getSheetRows("tracerStudy");
    respond(res, aggregateTracerStudy(rows, config.targets));
  })
);

router.get(
  "/karir",
  handle(async (req, res) => {
    const tahunPelaporan = req.query.tahunPelaporan;
    const rows = await getSheetRows("karir");
    respond(res, aggregateKarir(rows, config.targets, tahunPelaporan));
  })
);

router.get(
  "/prestasi",
  handle(async (req, res) => {
    const rows = await getSheetRows("prestasi");
    respond(res, aggregatePrestasi(rows));
  })
);

router.get(
  "/kegiatan",
  handle(async (req, res) => {
    const rows = await getSheetRows("kegiatan");
    respond(res, aggregateKegiatan(rows));
  })
);

router.get(
  "/overview",
  handle(async (req, res) => {
    const [tracerRows, karirRows, prestasiRows, kegiatanRows] = await Promise.all([
      getSheetRows("tracerStudy"),
      getSheetRows("karir"),
      getSheetRows("prestasi"),
      getSheetRows("kegiatan"),
    ]);

    const tracerStudy = aggregateTracerStudy(tracerRows, config.targets);
    const karir = aggregateKarir(karirRows, config.targets); // semua tahun untuk overview
    const prestasi = aggregatePrestasi(prestasiRows);
    const kegiatan = aggregateKegiatan(kegiatanRows);

    const tepatWaktuRataRata =
      tracerStudy.summary.reduce((sum, s) => sum + s.pct, 0) / (tracerStudy.summary.length || 1);

    respond(res, {
      totalAlumniTerdata: tracerRows.length,
      tepatWaktuRataRata: Math.round(tepatWaktuRataRata * 10) / 10,
      totalPrestasi: prestasi.summary.total,
      totalKegiatanLuarKampus: kegiatan.summary.total,
      totalPertukaranMahasiswa: kegiatan.summary.totalPertukaran,
      tracerStudySummary: tracerStudy.summary,
      statusCounts: karir.statusCounts,
      byTingkatPrestasi: prestasi.byTingkat,
    });
  })
);
