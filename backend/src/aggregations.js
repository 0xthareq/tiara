import { toViewableDriveLink } from "./driveClient.js";

const toNum = (v) => {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const pct = (numerator, denominator) =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;

/* =========================================================
   1. Tracer Study — Kelulusan Tepat Waktu
   ========================================================= */
export function aggregateTracerStudy(rows, targets) {
  const byJenjang = { S1: [], S2: [] };
  rows.forEach((r) => {
    if (byJenjang[r.Jenjang]) byJenjang[r.Jenjang].push(r);
  });

  const summary = ["S1", "S2"].map((jenjang) => {
    const group = byJenjang[jenjang];
    const tepatWaktu = group.filter((r) => r.LulusTepatWaktu === "Ya").length;
    return {
      jenjang,
      total: group.length,
      tepatWaktu,
      pct: pct(tepatWaktu, group.length),
      target: jenjang === "S1" ? targets.tepatWaktuS1 : targets.tepatWaktuS2,
    };
  });

  const trendMap = new Map();
  rows.forEach((r) => {
    const key = `${r.TahunLulus}__${r.Jenjang}`;
    if (!trendMap.has(key)) {
      trendMap.set(key, { tahun: r.TahunLulus, jenjang: r.Jenjang, total: 0, tepatWaktu: 0 });
    }
    const entry = trendMap.get(key);
    entry.total += 1;
    if (r.LulusTepatWaktu === "Ya") entry.tepatWaktu += 1;
  });
  const trend = Array.from(trendMap.values())
    .map((e) => ({ ...e, pct: pct(e.tepatWaktu, e.total) }))
    .sort((a, b) => (a.tahun > b.tahun ? 1 : -1));

  return { summary, trend, tableRows: rows };
}

/* =========================================================
   2. Tracer Study — Karier Alumni (selaras IKU 1)
   ========================================================= */
export function aggregateKarir(rows, targets) {
  const enriched = rows.map((r) => {
    const masaTunggu = toNum(r.MasaTungguBulan);
    const rasioGaji = toNum(r.RasioGajiUMR);
    const layak =
      (r.StatusUtama === "Bekerja" || r.StatusUtama === "Wirausaha") &&
      masaTunggu !== null &&
      masaTunggu <= targets.masaTungguBulan &&
      rasioGaji !== null &&
      rasioGaji >= targets.rasioGajiUmr;
    const memenuhiIku1 = layak || r.StatusUtama === "Lanjut Studi";
    return {
      ...r,
      MasaTungguBulan: masaTunggu,
      RasioGajiUMR: rasioGaji,
      MemenuhiIKU1: memenuhiIku1 ? "Ya" : "Tidak",
      BuktiLink: toViewableDriveLink(r.BuktiLink),
    };
  });

  const total = enriched.length;
  const statusCounts = ["Bekerja", "Wirausaha", "Lanjut Studi", "Belum Bekerja"].map(
    (status) => ({ status, jumlah: enriched.filter((r) => r.StatusUtama === status).length })
  );

  const masaTungguBuckets = [
    { label: "< 6 bulan", min: 0, max: 6 },
    { label: "6 - 12 bulan", min: 6.0001, max: 12 },
    { label: "> 12 bulan", min: 12.0001, max: Infinity },
  ].map((bucket) => ({
    label: bucket.label,
    jumlah: enriched.filter(
      (r) => r.MasaTungguBulan !== null && r.MasaTungguBulan >= bucket.min && r.MasaTungguBulan <= bucket.max
    ).length,
  }));

  const memenuhiCount = enriched.filter((r) => r.MemenuhiIKU1 === "Ya").length;

  return {
    summary: {
      total,
      memenuhiIku1: memenuhiCount,
      pctIku1: pct(memenuhiCount, total),
      target: targets.masaTungguBulan,
      targetRasioGaji: targets.rasioGajiUmr,
    },
    statusCounts,
    masaTungguBuckets,
    tableRows: enriched,
  };
}

/* =========================================================
   3. Prestasi Mahasiswa
   ========================================================= */
const TINGKAT_ORDER = ["Internasional", "Nasional", "Provinsi"];
const CAPAIAN_ORDER = ["Juara 1", "Juara 2", "Juara 3", "Finalis", "Favorit"];

export function aggregatePrestasi(rows) {
  const matrix = TINGKAT_ORDER.map((tingkat) => {
    const row = { tingkat };
    CAPAIAN_ORDER.forEach((capaian) => {
      row[capaian] = rows.filter((r) => r.Tingkat === tingkat && r.Capaian === capaian).length;
    });
    row.total = rows.filter((r) => r.Tingkat === tingkat).length;
    return row;
  });

  const byTingkat = TINGKAT_ORDER.map((tingkat) => ({
    tingkat,
    jumlah: rows.filter((r) => r.Tingkat === tingkat).length,
  }));

  const trendMap = new Map();
  rows.forEach((r) => {
    trendMap.set(r.Tahun, (trendMap.get(r.Tahun) || 0) + 1);
  });
  const trend = Array.from(trendMap.entries())
    .map(([tahun, jumlah]) => ({ tahun, jumlah }))
    .sort((a, b) => (a.tahun > b.tahun ? 1 : -1));

  return {
    summary: { total: rows.length },
    matrix,
    byTingkat,
    trend,
    tableRows: rows.map((r) => ({ ...r, BuktiLink: toViewableDriveLink(r.BuktiLink) })),
  };
}

/* =========================================================
   4. Kegiatan & Pertukaran Mahasiswa di Luar Kampus
   ========================================================= */
export function aggregateKegiatan(rows) {
  const byJenis = new Map();
  rows.forEach((r) => {
    byJenis.set(r.JenisKegiatan, (byJenis.get(r.JenisKegiatan) || 0) + 1);
  });
  const byJenisKegiatan = Array.from(byJenis.entries())
    .map(([jenis, jumlah]) => ({ jenis, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah);

  const sksBuckets = [
    { label: "\u2264 5 SKS", test: (n) => n <= 5 },
    { label: "6 - 10 SKS", test: (n) => n >= 6 && n <= 10 },
    { label: "> 10 SKS", test: (n) => n > 10 },
  ].map((bucket) => ({
    label: bucket.label,
    jumlah: rows.filter((r) => bucket.test(toNum(r.JumlahSKS) ?? 0)).length,
  }));

  const totalPertukaran = rows.filter((r) => r.JenisKegiatan === "Pertukaran Mahasiswa").length;

  return {
    summary: { total: rows.length, totalPertukaran },
    byJenisKegiatan,
    sksBuckets,
    tableRows: rows.map((r) => ({ ...r, BuktiLink: toViewableDriveLink(r.BuktiLink) })),
  };
}
