# TIARA — Tracer Study, Informasi Alumni, dan Prestasi Mahasiswa

Dashboard untuk memantau data tracer study lulusan, karier alumni, prestasi mahasiswa, dan kegiatan di luar kampus FMIPA Universitas Tanjungpura. Data diisi lewat Google Form, tersimpan di Google Sheet, file pendukung (sertifikat, surat keterangan, dsb.) otomatis tersimpan di Google Drive — dashboard ini membaca semuanya dan menyajikannya sebagai statistik dan grafik.

Struktur indikator yang dipakai mengikuti kategori resmi yang umum digunakan perguruan tinggi (IKU): kelulusan tepat waktu, lulusan yang bekerja/berwirausaha/lanjut studi dengan masa tunggu dan rasio gaji terhadap UMR, prestasi mahasiswa tingkat internasional/nasional/provinsi, serta kegiatan pembelajaran di luar kampus termasuk program pertukaran mahasiswa.

## Cara kerja singkat

Google Form &rarr; Google Sheet (jadi "database") &rarr; backend Node.js membaca Sheet lewat Google Sheets API &rarr; backend menghitung ringkasan & menyiapkan data grafik &rarr; frontend React menampilkannya sebagai dashboard. File yang diunggah lewat Form (misalnya sertifikat lomba) otomatis masuk ke Google Drive, dan tautannya otomatis tercatat di Sheet oleh Google Form sendiri — dashboard ini hanya menampilkan tautan tersebut, tidak perlu mengelola upload file secara manual.

## Struktur proyek

```
tiara/
  backend/     -> server Node.js + Express, baca Google Sheets API
  frontend/    -> dashboard React + Vite + Tailwind
```

## Mode Demo

Sebelum Google Sheets dihubungkan, backend otomatis berjalan dalam **mode demo** dan memakai data contoh, supaya tampilan dashboard sudah bisa langsung dicoba. Akan ada label kuning "Mode Demo" di setiap halaman selama mode ini aktif. Begitu `SPREADSHEET_ID` dan kredensial Google diisi di `.env`, dashboard otomatis beralih membaca data asli.

## Menjalankan di komputer sendiri

Butuh [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
# 1. Backend
cd backend
cp .env.example .env
npm install
npm run dev          # jalan di http://localhost:4000

# 2. Frontend (di terminal terpisah)
cd frontend
npm install
npm run dev           # jalan di http://localhost:5173
```

Buka `http://localhost:5173` di browser. Karena `.env` backend belum diisi, dashboard akan tampil dengan data contoh (mode demo).

## Menghubungkan Google Sheets & Drive asli

### 1. Siapkan Google Sheet dengan 4 tab

Buat satu spreadsheet, lalu buat 4 tab (sheet) dengan nama dan kolom **persis** seperti di bawah ini (huruf besar/kecil berpengaruh). Baris pertama setiap tab harus berisi nama kolom ini.

**Tab `TracerStudy_Kelulusan`**
NIM, Nama, ProgramStudi, Jenjang, TahunMasuk, TahunLulus, LulusTepatWaktu

**Tab `TracerStudy_Karir`**
NIM, Nama, ProgramStudi, TanggalLulus, StatusUtama, MasaTungguBulan, RasioGajiUMR, InstitusiTujuan, BuktiLink

**Tab `TracerStudy_Karir` &mdash; nilai yang valid:**
- `StatusUtama`: Bekerja / Wirausaha / Lanjut Studi / Belum Bekerja
- `MasaTungguBulan`: angka (bulan)
- `RasioGajiUMR`: angka, contoh 1.3 berarti gaji 1,3 kali UMR daerah

**Tab `PrestasiMahasiswa`**
NIM, Nama, ProgramStudi, NamaKegiatan, Tingkat, Capaian, Tahun, BuktiLink

**Tab `PrestasiMahasiswa` &mdash; nilai yang valid:**
- `Tingkat`: Internasional / Nasional / Provinsi
- `Capaian`: Juara 1 / Juara 2 / Juara 3 / Finalis / Favorit

**Tab `KegiatanLuarKampus`**
NIM, Nama, ProgramStudi, JenisKegiatan, JumlahSKS, Mitra, Periode, BuktiLink

Kolom `BuktiLink` di tiga tab terakhir diisi otomatis oleh Google Form jika pertanyaan terkait menggunakan tipe "Unggah berkas" (file upload) — jawabannya berupa tautan Google Drive yang langsung tersimpan di kolom itu.

> Nama tab bisa diganti, asal disesuaikan juga di `backend/src/config.js` (bagian `SHEET_NAMES`).

### 2. Hubungkan Google Form ke Sheet ini

Buat 3&ndash;4 Google Form (boleh satu Form per tab, atau gabungkan sesuai kebutuhan). Saat membuat Form, di tab "Responses" pilih ikon Google Sheets &rarr; "Select existing spreadsheet" &rarr; pilih spreadsheet yang sudah dibuat. Google Form akan membuat tab baru untuk responsnya &mdash; ganti nama tab tersebut menjadi salah satu nama di atas, dan ganti judul setiap pertanyaan supaya baris pertama (header) tabnya cocok dengan daftar kolom di atas (atau cukup sunting langsung baris header-nya setelah tab terbuat).

### 3. Buat Service Account di Google Cloud

Backend membaca Sheet menggunakan **service account** (bukan login akun pribadi), supaya bisa berjalan otomatis tanpa harus ada orang yang login.

1. Buka [Google Cloud Console](https://console.cloud.google.com/) &rarr; buat project baru (atau pakai yang sudah ada).
2. Buka **APIs & Services &rarr; Library**, aktifkan **Google Sheets API** dan **Google Drive API**.
3. Buka **APIs & Services &rarr; Credentials &rarr; Create Credentials &rarr; Service Account**. Beri nama apa saja, lalu selesaikan pembuatannya.
4. Klik service account yang baru dibuat &rarr; tab **Keys** &rarr; **Add Key &rarr; Create new key &rarr; JSON**. Sebuah file `.json` akan terunduh &mdash; ini kredensialnya, **jangan dibagikan ke siapa pun atau diunggah ke tempat publik**.
5. Buka file JSON itu, cari nilai `client_email` (formatnya seperti `nama@project-id.iam.gserviceaccount.com`).
6. Buka spreadsheet Google Sheets kamu &rarr; klik **Share** &rarr; tempel alamat `client_email` tadi &rarr; beri akses **Viewer** sudah cukup (backend hanya membaca data).

### 4. Isi file `.env` backend

```bash
SPREADSHEET_ID=isi_dengan_id_spreadsheet
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

`SPREADSHEET_ID` ada di URL spreadsheet, di antara `/d/` dan `/edit`. Simpan file JSON service account sebagai `backend/service-account.json` (sudah otomatis diabaikan oleh `.gitignore`, tidak akan tidak sengaja ikut ter-commit).

Untuk deployment ke layanan hosting (lihat bagian Deployment), gunakan `GOOGLE_SERVICE_ACCOUNT_JSON` (isi seluruh teks file JSON sebagai satu baris) karena kebanyakan layanan hosting tidak punya tempat menyimpan file persisten.

Restart backend (`npm run dev`), label "Mode Demo" akan hilang dan dashboard mulai menampilkan data asli dari spreadsheet.

## Mengatur target indikator

Target setiap indikator bisa diubah di `.env` backend tanpa mengubah kode:

```bash
TARGET_TEPAT_WAKTU_S1=80
TARGET_TEPAT_WAKTU_S2=80
TARGET_MASA_TUNGGU_BULAN=6
TARGET_RASIO_GAJI_UMR=1.2
```

## Deployment

**Opsi A &mdash; satu server saja (paling sederhana).**
Build frontend, lalu jalankan backend seperti biasa &mdash; backend otomatis ikut menyajikan dashboard-nya:

```bash
cd frontend && npm install && npm run build
cd ../backend && npm install && npm start
```

Cocok untuk hosting seperti Railway, Render, atau VPS biasa: satu proses, satu domain, tanpa masalah CORS.

**Opsi B &mdash; frontend dan backend di layanan berbeda** (misal frontend di Vercel/Netlify, backend di Railway/Render). Set environment variable `VITE_API_URL` di frontend ke URL backend (contoh: `https://tiara-api.namadomain.com/api`), dan set `CORS_ORIGIN` di backend ke URL frontend.

Pada kedua opsi, jangan lupa isi environment variable yang sama seperti di `.env` (terutama `GOOGLE_SERVICE_ACCOUNT_JSON` dan `SPREADSHEET_ID`) di panel environment variables layanan hosting yang dipakai.

## Teknologi yang dipakai

Backend: Node.js, Express, googleapis. Frontend: React, Vite, Tailwind CSS, Recharts (grafik), React Router, lucide-react (ikon).
