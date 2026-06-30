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
   Sumber: data import Excel manual dari pimpinan fakultas
   (Google Form Prestasi lama dinonaktifkan sementara,
   menunggu persetujuan pimpinan — data lama TIDAK dihapus).

   Kolom dari Sheet (sesuai header Excel):
   NIM | Nama | Program Studi | Jenis Aktivitas |
   Tanggal Pengajuan | Tanggal Mulai Aktivitas |
   Tanggal Akhir Aktivitas | Nama Aktivitas | Tingkat Prestasi |
   Status Valid | SKPI | Poin | validator
   (Status Valid / SKPI / Poin / validator sengaja tidak dipakai)

   Catatan: data ini TIDAK punya kolom "Capaian" (Juara 1/2/3,
   Finalis, dll) seperti Google Form lama — jadi breakdown
   matrix diganti per Jenis Aktivitas, bukan per Capaian.
   ========================================================= */
const TINGKAT_ORDER = [
  "Internasional",
  "Nasional",
  "Regional",
  "Provinsi",
  "Kabupaten/Kota",
  "Sekolah",
  "Lainnya",
];
const JENIS_AKTIVITAS_ORDER = ["Kompetisi", "Aktivitas Kemahasiswaan"];

// Ambil 4 digit tahun dari tanggal mulai aktivitas (format umum: YYYY-MM-DD).
// Dipakai untuk tren tahunan karena lebih merepresentasikan kapan
// prestasi/aktivitas itu terjadi (bukan kapan diajukan/diinput ke sheet).
function deriveTahun(raw) {
  const match = String(raw || "").match(/\d{4}/);
  return match ? match[0] : "";
}

export function aggregatePrestasi(rows) {
  const enriched = rows
    .map((r) => ({
      NIM:            r.NIM || "",
      Nama:           r.Nama || "",
      ProgramStudi:   r["Program Studi"] || "",
      JenisAktivitas: String(r["Jenis Aktivitas"] || "").trim(),
      NamaAktivitas:  r["Nama Aktivitas"] || "",
      Tingkat:        String(r["Tingkat Prestasi"] || "").trim(),
      Tahun:          deriveTahun(r["Tanggal Mulai Aktivitas"]),
    }))
    // Buang baris kosong / header yang nyasar ikut ke-import
    .filter((r) => r.Nama && r.Tingkat && r.NIM !== "NIM");

  // Matrix: Tingkat x Jenis Aktivitas (pengganti Tingkat x Capaian)
  const matrix = TINGKAT_ORDER.map((tingkat) => {
    const row = { tingkat };
    JENIS_AKTIVITAS_ORDER.forEach((jenis) => {
      row[jenis] = enriched.filter((r) => r.Tingkat === tingkat && r.JenisAktivitas === jenis).length;
    });
    row.total = enriched.filter((r) => r.Tingkat === tingkat).length;
    return row;
  });

  const byTingkat = TINGKAT_ORDER.map((tingkat) => ({
    tingkat,
    jumlah: enriched.filter((r) => r.Tingkat === tingkat).length,
  })).filter((t) => t.jumlah > 0 || TINGKAT_ORDER.includes(t.tingkat));

  const trendMap = new Map();
  enriched.forEach((r) => {
    if (r.Tahun) trendMap.set(r.Tahun, (trendMap.get(r.Tahun) || 0) + 1);
  });
  const trend = Array.from(trendMap.entries())
    .map(([tahun, jumlah]) => ({ tahun, jumlah }))
    .sort((a, b) => (a.tahun > b.tahun ? 1 : -1));

  return {
    summary: { total: enriched.length },
    matrix,
    byTingkat,
    jenisAktivitasOrder: JENIS_AKTIVITAS_ORDER,
    trend,
    tableRows: enriched,
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

/* =========================================================
   5. Data Beasiswa Mahasiswa Aktif
   Kolom dari Google Form (sesuai header di Sheet):
   Timestamp | Nama Lengkap | NIM | Program Studi |
   Semester Saat Ini | Indeks Prestasi Kumulatif (IPK) Terakhir |
   Nama Beasiswa yang didapat | Tahun mendapatkan beasiswa |
   Masa Berlaku Beasiswa | Bukti penerimaan beasiswa |
   Aapakah anda menerima lebih dari 1 beasiswa ? |
   Nama beasiswa lainnya
   ========================================================= */
export function aggregateBeasiswa(rows) {
  const COL = {
    nama:         "Nama Lengkap",
    nim:          "NIM",
    prodi:        "Program Studi",
    semester:     "Semester Saat Ini",
    ipk:          "Indeks Prestasi Kumulatif (IPK) Terakhir",
    namaBeasiswa: "Nama Beasiswa yang didapat",
    tahun:        "Tahun mendapatkan beasiswa",
    masaBerlaku:  "Masa Berlaku Beasiswa",
    bukti:        "Bukti penerimaan beasiswa",
    multiple:     "Aapakah anda menerima lebih dari 1 beasiswa ?",
    namaLainnya:  "Nama beasiswa lainnya",
  };

  const normIpk = (v) => {
    const n = toNum(v);
    return n !== null && n >= 0 && n <= 4 ? n : null;
  };

  const enriched = rows.map((r) => ({
    nama:         r[COL.nama]         || "",
    nim:          r[COL.nim]          || "",
    prodi:        r[COL.prodi]        || "",
    semester:     r[COL.semester]     || "",
    ipk:          normIpk(r[COL.ipk]),
    namaBeasiswa: r[COL.namaBeasiswa] || "",
    tahun:        String(r[COL.tahun] || "").trim(),
    masaBerlaku:  r[COL.masaBerlaku]  || "",
    bukti:        toViewableDriveLink(r[COL.bukti]),
    punyaMultiple: String(r[COL.multiple] || "").trim().toLowerCase() === "ya",
    namaLainnya:  r[COL.namaLainnya]  || "",
  }));

  const total = enriched.length;
  const multipleBeasiswa = enriched.filter((r) => r.punyaMultiple).length;

  // Rata-rata IPK
  const ipkValues = enriched.map((r) => r.ipk).filter((v) => v !== null);
  const rataRataIpk =
    ipkValues.length > 0
      ? Math.round((ipkValues.reduce((s, v) => s + v, 0) / ipkValues.length) * 100) / 100
      : 0;

  // Sebaran per prodi
  const prodiMap = new Map();
  enriched.forEach((r) => {
    if (r.prodi) prodiMap.set(r.prodi, (prodiMap.get(r.prodi) || 0) + 1);
  });
  const byProdi = Array.from(prodiMap.entries())
    .map(([prodi, count]) => ({ prodi, count }))
    .sort((a, b) => b.count - a.count);

  // Ranking jenis beasiswa (termasuk beasiswa ke-2 jika ada)
  const beasiswaMap = new Map();
  enriched.forEach((r) => {
    if (r.namaBeasiswa) {
      beasiswaMap.set(r.namaBeasiswa, (beasiswaMap.get(r.namaBeasiswa) || 0) + 1);
    }
    if (r.punyaMultiple && r.namaLainnya) {
      r.namaLainnya
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((name) => {
          beasiswaMap.set(name, (beasiswaMap.get(name) || 0) + 1);
        });
    }
  });
  const beasiswaUnik = beasiswaMap.size;
  const byBeasiswa = Array.from(beasiswaMap.entries())
    .map(([nama, count]) => ({ nama, count }))
    .sort((a, b) => b.count - a.count);

  // Sebaran per semester (urut nomor semester)
  const semesterMap = new Map();
  enriched.forEach((r) => {
    if (r.semester) semesterMap.set(r.semester, (semesterMap.get(r.semester) || 0) + 1);
  });
  const bySemester = Array.from(semesterMap.entries())
    .map(([semester, count]) => ({ semester, count }))
    .sort((a, b) => {
      const na = parseInt(a.semester.replace(/\D/g, ""), 10) || 0;
      const nb = parseInt(b.semester.replace(/\D/g, ""), 10) || 0;
      return na - nb;
    });

  // Tren per tahun
  const tahunMap = new Map();
  enriched.forEach((r) => {
    if (r.tahun) tahunMap.set(r.tahun, (tahunMap.get(r.tahun) || 0) + 1);
  });
  const byTahun = Array.from(tahunMap.entries())
    .map(([tahun, count]) => ({ tahun, count }))
    .sort((a, b) => a.tahun.localeCompare(b.tahun));

  return {
    summary: { total, rataRataIpk, beasiswaUnik, multipleBeasiswa },
    byProdi,
    byBeasiswa,
    bySemester,
    byTahun,
    tableRows: enriched,
  };
}

/* =========================================================
   6. Data Lulusan per Tahun Ajar & Periode
   Input: tabData = [{ tahunAjar: "2025/2026", rows: [{
     PRODI, "PERIODE 1", "PERIODE 2", "PERIODE 3", "PERIODE 4"
   }] }]
   ========================================================= */
export function aggregateLulusan(tabData) {
  const toN = (v) => {
    const n = parseInt(String(v ?? "0").replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  };

  // Enrich tiap tab: hitung total per baris & total per tahun
  const enriched = tabData.map(({ tahunAjar, rows }) => {
    const prodiRows = rows.map((r) => {
      const p1 = toN(r["PERIODE 1"]);
      const p2 = toN(r["PERIODE 2"]);
      const p3 = toN(r["PERIODE 3"]);
      const p4 = toN(r["PERIODE 4"]);
      return {
        prodi:    String(r.PRODI || "").trim(),
        periode1: p1,
        periode2: p2,
        periode3: p3,
        periode4: p4,
        total:    p1 + p2 + p3 + p4,
      };
    });
    const totalTahun = prodiRows.reduce((s, r) => s + r.total, 0);
    return { tahunAjar, rows: prodiRows, total: totalTahun };
  });

  // Summary per tahun (untuk grafik tren)
  const byTahun = enriched.map(({ tahunAjar, total }) => ({ tahunAjar, total }));
  const totalKeseluruhan = enriched.reduce((s, t) => s + t.total, 0);

  // Data tahun terbaru (enriched sudah descending → index 0)
  const latest = enriched[0] ?? { tahunAjar: "-", rows: [], total: 0 };

  // Perbandingan lintas tahun per prodi
  const prodiSet = new Set();
  enriched.forEach(({ rows }) => rows.forEach((r) => prodiSet.add(r.prodi)));

  const byProdi = Array.from(prodiSet)
    .map((prodi) => {
      const perTahun = enriched.map(({ tahunAjar, rows }) => {
        const row = rows.find((r) => r.prodi === prodi);
        return { tahunAjar, total: row ? row.total : 0 };
      });
      return {
        prodi,
        perTahun,
        totalKeseluruhan: perTahun.reduce((s, r) => s + r.total, 0),
      };
    })
    .sort((a, b) => b.totalKeseluruhan - a.totalKeseluruhan);

  return {
    summary:  { totalKeseluruhan, byTahun },
    latest,           // detail tahun terbaru (per prodi + per periode)
    allYears: enriched,
    byProdi,          // perbandingan lintas tahun per prodi
  };
}
