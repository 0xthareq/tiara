import { toViewableDriveLink } from "./driveClient.js";

const toNum = (v) => {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const pct = (numerator, denominator) =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;

/* ---------------------------------------------------------
   Helper: derive Jenjang (S1/S2) dari teks Program Studi.
   Form tidak punya kolom Jenjang terpisah — opsi dropdownnya
   sudah membedakan "S2 Kimia" dari prodi lain (default S1).
   --------------------------------------------------------- */
function deriveJenjang(programStudi) {
  return /^s2/i.test(String(programStudi || "").trim()) ? "S2" : "S1";
}

/* ---------------------------------------------------------
   Helper: ubah jawaban kategori "Masa Tunggu" dari Google Form
   menjadi perkiraan angka bulan, supaya tetap bisa dihitung
   rata-rata / dibandingkan ke target. Tetap mendukung input
   angka murni (mis. dari data demo / input manual).
   --------------------------------------------------------- */
function parseMasaTunggu(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const s = String(raw).trim();

  const n = toNum(s);
  if (n !== null) return n; // sudah berupa angka

  if (/1,5|1\.5/.test(s)) return 19; // "> 1,5 tahun"
  if (/>\s*1\s*tahun/i.test(s)) return 13; // "> 1 tahun"
  if (/6.*12/.test(s)) return 9; // "6 - 12 bulan"
  if (/<\s*6/.test(s)) return 3; // "< 6 bulan"
  return null;
}

/* ---------------------------------------------------------
   Helper: ubah jawaban kategori "Gaji vs UMR" menjadi rasio
   numerik perkiraan, untuk dibandingkan ke target IKU 1.
   --------------------------------------------------------- */
function parseRasioGaji(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const s = String(raw).trim();

  const n = toNum(s);
  if (n !== null) return n; // sudah berupa angka

  if (/<\s*1,2|<\s*1\.2/.test(s)) return 1.0; // "< 1,2x UMR"
  if (/>\s*2/.test(s)) return 2.5; // "> 2x UMR"
  if (/1,2.*2|1\.2.*2/.test(s)) return 1.5; // "1,2 - 2x UMR"
  return null;
}

/* ---------------------------------------------------------
   Helper: normalisasi label status karir. Pilihan di Google
   Form pakai kata "Wiraswasta" / "Melanjutkan Studi" / "Belum
   Bekerja / Sedang Mencari Pekerjaan" — disamakan ke label
   kanonik yang dipakai di seluruh dashboard.
   --------------------------------------------------------- */
function normalizeStatus(raw) {
  const s = String(raw || "").trim();
  if (s === "Bekerja") return "Bekerja";
  if (s === "Wiraswasta" || s === "Wirausaha") return "Wirausaha";
  if (s === "Melanjutkan Studi" || s === "Lanjut Studi") return "Lanjut Studi";
  if (s.startsWith("Belum Bekerja")) return "Belum Bekerja";
  return s;
}

/* =========================================================
   1. Tracer Study — Kelulusan Tepat Waktu
   ========================================================= */
export function aggregateTracerStudy(rows, targets) {
  const enriched = rows.map((r) => ({
    ...r,
    Jenjang: r.Jenjang || deriveJenjang(r.ProgramStudi),
  }));

  const byJenjang = { S1: [], S2: [] };
  enriched.forEach((r) => {
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
  enriched.forEach((r) => {
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

  return { summary, trend, tableRows: enriched };
}

/* =========================================================
   2. Tracer Study — Karier Alumni (selaras IKU 1)
   ========================================================= */
export function aggregateKarir(rows, targets, tahunPelaporan) {
  // Filter hanya alumni yang lulus pada tahun T-1 (sesuai standar IKU 1).
  // Jika tahunPelaporan tidak diberikan, gunakan semua data (fallback).
  const tahunLulusTarget = tahunPelaporan
    ? String(Number(tahunPelaporan) - 1)
    : null;

  const filtered = tahunLulusTarget
    ? rows.filter((r) => String(r.TahunLulus) === tahunLulusTarget)
    : rows;

  const enriched = filtered.map((r) => {
    const statusUtama = normalizeStatus(r.StatusUtama);
    const masaTunggu = parseMasaTunggu(r.MasaTungguBulan);
    const rasioGaji = parseRasioGaji(r.RasioGajiUMR);

    // Kriteria IKU 1 per Kemendikti Saintek:
    // - Wirausaha    → otomatis layak (tanpa syarat gaji/masa tunggu)
    // - Lanjut Studi → otomatis layak
    // - Bekerja      → layak jika masa tunggu ≤ target DAN gaji ≥ target UMR
    // - Belum Bekerja → tidak layak
    let memenuhiIku1;
    if (statusUtama === "Wirausaha" || statusUtama === "Lanjut Studi") {
      memenuhiIku1 = true;
    } else if (statusUtama === "Bekerja") {
      memenuhiIku1 =
        masaTunggu !== null &&
        masaTunggu <= targets.masaTungguBulan &&
        rasioGaji !== null &&
        rasioGaji >= targets.rasioGajiUmr;
    } else {
      memenuhiIku1 = false;
    }

    return {
      ...r,
      StatusUtama: statusUtama,
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
      tahunLulus: tahunLulusTarget,
      tahunPelaporan: tahunPelaporan ? String(tahunPelaporan) : null,
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
const TINGKAT_ORDER = ["Internasional", "Nasional", "Provinsi", "Universitas", "Fakultas"];
const CAPAIAN_ORDER = ["Juara 1", "Juara 2", "Juara 3", "Harapan 1", "Harapan 2", "Harapan 3", "Finalis", "Favorit"];

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
