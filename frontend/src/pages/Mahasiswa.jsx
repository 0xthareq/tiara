import { Users, Construction } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";

const PREVIEW_STATS = [
  { label: "Total Mahasiswa Aktif", desc: "Jumlah mahasiswa terdaftar aktif saat ini" },
  { label: "Sebaran per Prodi",     desc: "Distribusi mahasiswa per program studi" },
  { label: "Sebaran per Semester",  desc: "Jumlah mahasiswa per angkatan / semester" },
  { label: "Rata-rata IPK",         desc: "IPK rata-rata seluruh mahasiswa aktif" },
];

export default function Mahasiswa() {
  return (
    <div>
      <PageHeader
        title="Data Lulusan Mahasiswa"
        subtitle="Monitoring data lulusan mahasiswa FMIPA Universitas Tanjungpura."
      />

      {/* Under construction notice */}
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-azuresoft flex items-center justify-center mb-5">
          <Users size={26} className="text-azure" strokeWidth={1.6} />
        </div>
        <h2 className="font-display font-bold text-xl text-ink mb-2">
          Dashboard sedang disiapkan
        </h2>
        <p className="text-sm text-inksoft max-w-sm leading-relaxed mb-10">
          Halaman ini akan menampilkan ringkasan data lulusan mahasiswa FMIPA.
          Data akan tersinkronisasi otomatis dari sumber data yang terhubung.
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
                <div className="w-2 h-2 rounded-full bg-azure mt-1.5 shrink-0" />
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
