import { Landmark, Construction } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";

const PREVIEW_STATS = [
  { label: "Total Penerima",        desc: "Jumlah mahasiswa aktif penerima beasiswa" },
  { label: "Distribusi Prodi",      desc: "Sebaran penerima per program studi" },
  { label: "Jenis Beasiswa",        desc: "Beasiswa terbanyak diterima mahasiswa" },
  { label: "Rata-rata IPK",         desc: "IPK rata-rata seluruh penerima beasiswa" },
  { label: "Penerima >1 Beasiswa",  desc: "Mahasiswa yang mendapatkan lebih dari satu beasiswa" },
  { label: "Tren per Tahun",        desc: "Grafik penerimaan beasiswa dari tahun ke tahun" },
];

export default function Beasiswa() {
  return (
    <div>
      <PageHeader
        title="Data Beasiswa"
        subtitle="Monitoring data mahasiswa aktif penerima beasiswa FMIPA Universitas Tanjungpura."
      />

      {/* Under construction notice */}
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-greensoft flex items-center justify-center mb-5">
          <Landmark size={26} className="text-green" strokeWidth={1.6} />
        </div>
        <h2 className="font-display font-bold text-xl text-ink mb-2">
          Dashboard sedang disiapkan
        </h2>
        <p className="text-sm text-inksoft max-w-sm leading-relaxed mb-10">
          Halaman ini akan menampilkan ringkasan data beasiswa mahasiswa aktif
          yang masuk melalui Google Form. Data akan tersinkronisasi otomatis.
        </p>

        {/* Preview of what will be shown */}
        <div className="w-full max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-inkfaint mb-4">
            Yang akan ditampilkan
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {PREVIEW_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-start gap-3 p-4 rounded-xl border border-line bg-surface opacity-60"
              >
                <div className="w-2 h-2 rounded-full bg-green mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">{stat.label}</p>
                  <p className="text-xs text-inkfaint mt-0.5">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-2 text-xs text-inkfaint bg-paper border border-line px-4 py-2 rounded-full">
          <Construction size={13} />
          Dalam pengembangan
        </div>
      </div>
    </div>
  );
}
