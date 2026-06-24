// Data contoh (mode demo). Dipakai otomatis ketika SPREADSHEET_ID atau
// kredensial Google belum dikonfigurasi, agar tampilan dashboard tetap
// bisa langsung dicoba sebelum integrasi Google Sheets diaktifkan.

// PRNG sederhana (mulberry32) supaya angka demo konsisten setiap server
// dijalankan, bukan acak-berubah setiap restart.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260229);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => Math.floor(min + rand() * (max - min + 1));

const PRODI_S1 = [
  "Matematika",
  "Statistika",
  "Fisika",
  "Geofisika",
  "Kimia",
  "Biologi",
  "Sistem Komputer",
  "Sistem Informasi",
  "Ilmu Kelautan",
];
const PRODI_S2 = ["Magister Kimia"];

const NAMA_DEPAN = [
  "Aulia", "Rangga", "Nadia", "Fajar", "Putri", "Yusuf", "Dewi", "Ilham",
  "Sarah", "Bagus", "Melati", "Reza", "Anisa", "Doni", "Citra", "Hafiz",
  "Larasati", "Indra", "Wulan", "Taufik", "Salsabila", "Eko", "Mega", "Hadi",
];
const NAMA_BELAKANG = [
  "Pratama", "Saputra", "Wijaya", "Permata", "Hidayat", "Lestari", "Nugraha",
  "Anggraini", "Setiawan", "Maharani", "Firmansyah", "Kusuma", "Ramadhan", "Utami",
];
const fullName = () => `${pick(NAMA_DEPAN)} ${pick(NAMA_BELAKANG)}`;
const nim = (prefix, i) => `${prefix}${String(i).padStart(4, "0")}`;

// ---------- 1. TracerStudy_Kelulusan ----------
const tracerStudy = [];
for (let i = 1; i <= 70; i++) {
  const jenjang = rand() < 0.85 ? "S1" : "S2";
  const prodi = jenjang === "S1" ? pick(PRODI_S1) : pick(PRODI_S2);
  const tahunLulus = pick([2022, 2023, 2024, 2025]);
  const lamaTahun = jenjang === "S1" ? int(3, 6) : int(2, 4);
  const tepatWaktu =
    jenjang === "S1" ? lamaTahun <= 4 : lamaTahun <= 2;
  tracerStudy.push({
    NIM: nim(jenjang === "S1" ? "H1" : "H2", i),
    Nama: fullName(),
    ProgramStudi: prodi,
    Jenjang: jenjang,
    TahunMasuk: String(tahunLulus - lamaTahun),
    TahunLulus: String(tahunLulus),
    LulusTepatWaktu: rand() < 0.05 ? (tepatWaktu ? "Tidak" : "Ya") : (tepatWaktu ? "Ya" : "Tidak"),
  });
}

// ---------- 2. TracerStudy_Karir ----------
const karir = [];
for (let i = 1; i <= 70; i++) {
  const prodi = pick([...PRODI_S1, ...PRODI_S2]);
  const status = pick(["Bekerja", "Bekerja", "Bekerja", "Wirausaha", "Lanjut Studi", "Belum Bekerja"]);
  const masaTunggu = status === "Belum Bekerja" ? "" : String(int(1, 14));
  const rasioGaji =
    status === "Bekerja" || status === "Wirausaha"
      ? (0.8 + rand() * 0.9).toFixed(2)
      : "";
  karir.push({
    NIM: nim("K", i),
    Nama: fullName(),
    ProgramStudi: prodi,
    TahunLulus: pick(["2022", "2023", "2024", "2025"]),
    StatusUtama: status,
    MasaTungguBulan: masaTunggu,
    RasioGajiUMR: rasioGaji,
    InstitusiTujuan:
      status === "Bekerja"
        ? pick(["PT Astra International", "Bank Kalbar", "Pemprov Kalbar", "PT Telkom Indonesia", "RS Untan", "Universitas Tanjungpura"])
        : status === "Wirausaha"
        ? pick(["Usaha Mandiri", "Startup Rintisan"])
        : status === "Lanjut Studi"
        ? pick(["UGM", "ITB", "IPB", "Universitas Tanjungpura"])
        : "",
    BuktiLink: rand() < 0.6 ? "https://drive.google.com/open?id=1aBcD3fGhIjKlMnOpQrStUvWxYz0000001" : "",
  });
}

// ---------- 3. PrestasiMahasiswa ----------
const KEGIATAN_LOMBA = [
  "Olimpiade Sains Nasional Bidang Kimia",
  "Kompetisi Statistika Ria",
  "ASEAN Mathematics Competition",
  "Lomba Karya Tulis Ilmiah Nasional",
  "Pekan Ilmiah Mahasiswa Nasional (Pimnas)",
  "International Physics Olympiad for University Students",
  "Kompetisi Riset Kelautan Tingkat Provinsi",
  "Hackathon Sistem Informasi Kalimantan",
];
const TINGKAT = ["Internasional", "Nasional", "Provinsi", "Universitas", "Fakultas"];
const CAPAIAN = ["Juara 1", "Juara 2", "Juara 3", "Harapan 1", "Harapan 2", "Harapan 3", "Finalis", "Favorit"];
const prestasi = [];
for (let i = 1; i <= 45; i++) {
  prestasi.push({
    NIM: nim("P", i),
    Nama: fullName(),
    ProgramStudi: pick(PRODI_S1),
    NamaKegiatan: pick(KEGIATAN_LOMBA),
    Tingkat: pick([...TINGKAT, "Nasional", "Universitas", "Fakultas"]),
    Capaian: pick(CAPAIAN),
    Tahun: String(pick([2023, 2024, 2025])),
    BuktiLink: "https://drive.google.com/open?id=1aBcD3fGhIjKlMnOpQrStUvWxYz0000002",
  });
}

// ---------- 4. KegiatanLuarKampus ----------
const JENIS_KEGIATAN = [
  "Pertukaran Mahasiswa",
  "Magang/Praktik Kerja",
  "Riset/Penelitian",
  "Proyek Kemanusiaan",
  "Wirausaha",
  "Proyek di Desa (KKN Tematik)",
  "Mengajar di Satuan Pendidikan",
  "Studi/Proyek Independen",
];
const kegiatan = [];
for (let i = 1; i <= 50; i++) {
  kegiatan.push({
    NIM: nim("M", i),
    Nama: fullName(),
    ProgramStudi: pick(PRODI_S1),
    JenisKegiatan: pick(JENIS_KEGIATAN),
    JumlahSKS: String(pick([3, 4, 5, 6, 8, 10, 12, 15, 20])),
    Mitra: pick(["Universitas Gadjah Mada", "Universitas Indonesia", "Pemkot Pontianak", "PT Pupuk Kaltim", "Dinas Kelautan Kalbar", "Universitas Brawijaya"]),
    Periode: pick(["Ganjil 2023/2024", "Genap 2023/2024", "Ganjil 2024/2025", "Genap 2024/2025"]),
    BuktiLink: "https://drive.google.com/open?id=1aBcD3fGhIjKlMnOpQrStUvWxYz0000003",
  });
}

// ---------- 5. Beasiswa Mahasiswa Aktif (tab: Form Responses 1) ----------
// Kunci pakai nama kolom persis sama dengan header Google Form,
// agar getSheetRows("beasiswa") bisa dipakai di mode demo.
const NAMA_BEASISWA_LIST = [
  "KIP Kuliah", "Bidikmisi", "BSI", "BRI Peduli",
  "Bank Indonesia", "Pertamina Foundation", "BAZNAS", "Beasiswa PPA",
];
const MASA_BERLAKU_LIST = [
  "1 semester", "2 semester", "1 tahun", "2 tahun", "Sampai lulus",
];
const beasiswaDemo = [];
for (let i = 1; i <= 45; i++) {
  const prodi     = pick(PRODI_S1);
  const semNum    = int(1, 10);
  const tahun     = pick([2022, 2023, 2024, 2025]);
  const ipk       = (3.0 + rand() * 1.0).toFixed(2);
  const nama1     = pick(NAMA_BEASISWA_LIST);
  const multiple  = rand() < 0.2;
  const nama2     = multiple
    ? pick(NAMA_BEASISWA_LIST.filter((n) => n !== nama1))
    : "";
  beasiswaDemo.push({
    "Timestamp":                                       `${tahun}/06/01 10:00:00`,
    "Nama Lengkap":                                    fullName(),
    "NIM":                                             nim("H1", i),
    "Program Studi":                                   prodi,
    "Semester Saat Ini":                               `Semester ${semNum}`,
    "Indeks Prestasi Kumulatif (IPK) Terakhir":        ipk,
    "Nama Beasiswa yang didapat":                      nama1,
    "Tahun mendapatkan beasiswa":                      String(tahun),
    "Masa Berlaku Beasiswa":                           pick(MASA_BERLAKU_LIST),
    "Bukti penerimaan beasiswa":                       "https://drive.google.com/open?id=1aBcD3fGhIjKlMnOpQrStUvWxYz000005",
    "Aapakah anda menerima lebih dari 1 beasiswa ?":   multiple ? "Ya" : "Tidak",
    "Nama beasiswa lainnya":                           nama2,
  });
}

// Tambahkan ke MOCK_ROWS — ekspor ulang agar tidak merombak pola file
export const MOCK_ROWS = {
  TracerStudy_Kelulusan: tracerStudy,
  TracerStudy_Karir:     karir,
  PrestasiMahasiswa:     prestasi,
  KegiatanLuarKampus:    kegiatan,
  "Form Responses 1":    beasiswaDemo,
};

// ---------- 6. Mock Data Lulusan (multi-tab format) ----------
// Setiap entry = satu tab spreadsheet (satu tahun ajar).
// Key kolom harus persis sama dengan header baris 2 di sheet asli.
const PRODI_LULUSAN = [
  "MATEMATIKA", "FISIKA", "KIMIA", "BIOLOGI",
  "REKAYASA SISTEM KOMPUTER", "GEOFISIKA", "ILMU KELAUTAN",
  "STATISTIKA", "SISTEM INFORMASI", "S2 KIMIA",
];

function makeLulusanTab(tahunAjar, seed) {
  const r = mulberry32(seed);
  return {
    tahunAjar,
    rows: PRODI_LULUSAN.map((prodi) => ({
      PRODI:      prodi,
      "PERIODE 1": String(Math.floor(r() * 50 + 5)),
      "PERIODE 2": String(Math.floor(r() * 25 + 2)),
      "PERIODE 3": String(Math.floor(r() * 30 + 3)),
    })),
  };
}

export const MOCK_LULUSAN_TABS = [
  makeLulusanTab("2025/2026", 2026),
  makeLulusanTab("2024/2025", 2025),
  makeLulusanTab("2023/2024", 2024),
];
