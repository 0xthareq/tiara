import {
  CheckCircle2,
  Clock,
  Circle,
  Database,
  LayoutDashboard,
  BarChart3,
  FileOutput,
  Sparkles,
} from "lucide-react";

const phases = [
  {
    id: 1,
    icon: Database,
    label: "Fase 1",
    title: "Fondasi & Perancangan Awal",
    status: "done",
    period: "Nov - Des 2025",
    color: "green",
    items: [
      { text: "Desain skema database alumni & mahasiswa", done: true },
      { text: "Integrasi database sebagai sumber data", done: true },
      { text: "Setup backend API (Node.js + Express)", done: true },
      { text: "Autentikasi data security", done: true },
      { text: "Deployment backend", done: true },
    ],
  },
  {
    id: 2,
    icon: LayoutDashboard,
    label: "Fase 2",
    title: "Dashboard Inti",
    status: "done",
    period: "Jan - Feb 2026",
    color: "green",
    items: [
      { text: "Halaman Beranda - ringkasan statistik & KPI", done: true },
      { text: "Tracer Study Kelulusan (tepat waktu)", done: true },
      { text: "Status Karier Alumni (bekerja, wirausaha, studi)", done: true },
      { text: "Prestasi Mahasiswa (internasional, nasional, provinsi, universitas, fakultas)", done: true },
      { text: "Kegiatan & Program Pertukaran Mahasiswa, dll", done: true },
    ],
  },
  {
    id: 3,
    icon: BarChart3,
    label: "Fase 3",
    title: "Analitik & Visualisasi",
    status: "active",
    period: "mar – Apr 2026",
    color: "azure",
    items: [
      { text: "Grafik tren kelulusan multi-tahun", done: true },
      { text: "Donut chart distribusi karier alumni", done: true },
      { text: "Bar chart perbandingan target vs capain IKU", done: false },
      { text: "Filter & drill-down berdasarkan tahun angkatan", done: false },
      { text: "Mode Demo dengan data contoh realistis", done: true },
    ],
  },
  {
    id: 4,
    icon: FileOutput,
    label: "Fase 4",
    title: "Pengumpulan Data & Aksesibilitas",
    status: "planned",
    period: "Mei – Jul 2026",
    color: "amber",
    items: [
      { text: "Desain Perencanaan Data", done: true },
      { text: "Form Tracer Study dan Prestasi disebar", done: true },
      { text: "Optimasi tampilan mobile & responsif", done: false },
      { text: "Mode gelap (dark mode)", done: false },
    ],
  },
  {
    id: 5,
    icon: Sparkles,
    label: "Fase 5",
    title: "Pengembangan Lanjutan",
    status: "planned",
    period: "Agt - des 2026 →",
    color: "inkfaint",
    items: [
      { text: "Terintegrasi dengan Portal Akademik & Kemahasiswaan FMIPA Untan", done: false },
      { text: "Mode Bahasa IND/ENG", done: false },
      { text: "Upgrade Hosting & Deployment", done: false },
      { text: "Penambahan Fitur Sesuai Kebutuhan", done: false },
    ],
  },
];

const statusConfig = {
  done: {
    label: "Selesai",
    icon: CheckCircle2,
    cls: "text-green bg-greensoft",
    ring: "border-green",
    dot: "bg-green",
  },
  active: {
    label: "Berlangsung",
    icon: Clock,
    cls: "text-azure bg-azuresoft",
    ring: "border-azure",
    dot: "bg-azure animate-pulse",
  },
  planned: {
    label: "Direncanakan",
    icon: Circle,
    cls: "text-inksoft bg-paper",
    ring: "border-line",
    dot: "bg-inkfaint",
  },
};

export default function Roadmap() {
  const done = phases.filter((p) => p.status === "done").length;
  const total = phases.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Roadmap Proyek</h1>
        <p className="text-sm text-inksoft">
          Rencana pengembangan TIARA - Tracer Study &amp; Prestasi Mahasiswa FMIPA Universitas Tanjungpura.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-surface rounded-2xl border border-line shadow-card p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink">Progress keseluruhan</span>
          <span className="font-display font-bold text-azure tabular">{pct}%</span>
        </div>
        <div className="h-2.5 bg-paper rounded-full overflow-hidden">
          <div
            className="h-full bg-azure rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-inksoft">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green inline-block" />
            {phases.filter((p) => p.status === "done").length} Selesai
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-azure inline-block animate-pulse" />
            {phases.filter((p) => p.status === "active").length} Berlangsung
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-inkfaint inline-block" />
            {phases.filter((p) => p.status === "planned").length} Direncanakan
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-line" />

        <div className="space-y-6">
          {phases.map((phase) => {
            const sc = statusConfig[phase.status];
            const PhaseIcon = phase.icon;
            const StatusIcon = sc.icon;

            return (
              <div key={phase.id} className="relative pl-16">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-4 w-12 h-12 rounded-xl border-2 bg-surface flex items-center justify-center ${sc.ring}`}
                >
                  <PhaseIcon size={20} strokeWidth={1.8} className={
                    phase.status === "done"
                      ? "text-green"
                      : phase.status === "active"
                      ? "text-azure"
                      : "text-inkfaint"
                  } />
                </div>

                {/* Card */}
                <div className="bg-surface rounded-2xl border border-line shadow-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-medium text-inkfaint uppercase tracking-wider">
                        {phase.label}
                      </span>
                      <h2 className="font-display font-bold text-ink text-base leading-snug">
                        {phase.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-inksoft">{phase.period}</span>
                      <span
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.cls}`}
                      >
                        <StatusIcon size={11} />
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={16}
                          strokeWidth={2}
                          className={`mt-0.5 flex-shrink-0 ${
                            item.done ? "text-green" : "text-line"
                          }`}
                        />
                        <span
                          className={`text-sm leading-snug ${
                            item.done ? "text-ink" : "text-inkfaint"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-inkfaint mt-10 mb-2">
        TIARA · FMIPA Universitas Tanjungpura · Roadmap diperbarui 2025
      </p>
    </div>
  );
}
