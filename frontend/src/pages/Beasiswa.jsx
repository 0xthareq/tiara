import { Landmark, Users, BookOpen, Award, FlaskConical } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { fetchBeasiswa } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const AZURE   = "#1E4FDE";
const GREEN   = "#2F9E5B";
const AMBER   = "#E08A2C";
const VIOLET  = "#7C3AED";

const PRODI_SHORT = {
  "Matematika":               "Matematika",
  "Fisika":                   "Fisika",
  "S1 Kimia":                 "S1 Kimia",
  "Biologi":                  "Biologi",
  "Rekayasa Sistem Komputer": "RSK",
  "Geofisika":                "Geofisika",
  "Ilmu Kelautan":            "Ilmu Kelautan",
  "Statistika":               "Statistika",
  "Sistem Informasi":         "Sistem Informasi",
  "S2 Kimia":                 "S2 Kimia",
};

const BAR_COLORS = [AZURE, GREEN, AMBER, VIOLET, "#E8407A", "#0EA5E9", "#F97316", "#14B8A6"];
const TT = { fontSize: 12, borderRadius: 8, border: "1px solid #E4E1D6", boxShadow: "0 2px 8px rgba(0,0,0,.06)" };

export default function Beasiswa() {
  const { data: payload, loading, error, reload } = useApiData(fetchBeasiswa);

  if (loading) return <LoadingState label="Memuat data beasiswa..." />;
  if (error)   return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, byProdi, byBeasiswa, bySemester, byTahun, tableRows } = payload.data;

  // Top 8 beasiswa untuk chart
  const topBeasiswa = byBeasiswa.slice(0, 8).map((b, i) => ({
    ...b,
    _color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  // Prodi chart — pakai label pendek
  const prodiChart = byProdi.map((p) => ({
    prodi: PRODI_SHORT[p.prodi] ?? p.prodi,
    count: p.count,
  }));

  // Kolom tabel
  const columns = [
    { key: "nim",          label: "NIM" },
    { key: "nama",         label: "Nama" },
    { key: "prodi",        label: "Program Studi" },
    { key: "semester",     label: "Semester" },
    { key: "ipk",          label: "IPK", render: (r) => r.ipk !== null ? r.ipk.toFixed(2) : "—" },
    { key: "namaBeasiswa", label: "Beasiswa" },
    { key: "tahun",        label: "Tahun" },
    { key: "masaBerlaku",  label: "Masa Berlaku" },
    {
      key: "punyaMultiple",
      label: ">1 Beasiswa",
      render: (r) => r.punyaMultiple
        ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-azuresoft text-azure">Ya</span>
        : <span className="text-xs text-inkfaint">Tidak</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Data Beasiswa"
        subtitle="Monitoring mahasiswa aktif penerima beasiswa FMIPA Universitas Tanjungpura."
        demoMode={payload.meta.demoMode}
      />

      {/* StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Users}    label="Total Penerima"       value={summary.total} />
        <StatCard icon={BookOpen} label="Rata-rata IPK"        value={summary.rataRataIpk.toFixed(2)} />
        <StatCard icon={Landmark} label="Jenis Beasiswa"       value={summary.beasiswaUnik} suffix=" jenis" />
        <StatCard icon={Award}    label="Penerima >1 Beasiswa" value={summary.multipleBeasiswa} suffix=" mhs" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">

        {/* Bar chart per prodi */}
        <ChartCard title="Penerima per Program Studi" subtitle="Jumlah mahasiswa penerima beasiswa">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={prodiChart} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E1D6" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="prodi" width={108} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={TT} formatter={(v) => [v, "Penerima"]} />
              <Bar dataKey="count" name="Penerima" radius={[0, 4, 4, 0]}>
                {prodiChart.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar chart per jenis beasiswa */}
        <ChartCard title="Jenis Beasiswa Terbanyak" subtitle={`Top ${topBeasiswa.length} beasiswa yang diterima mahasiswa`}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topBeasiswa} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E1D6" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="nama" width={130} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={TT} formatter={(v) => [v, "Penerima"]} />
              <Bar dataKey="count" name="Penerima" radius={[0, 4, 4, 0]}>
                {topBeasiswa.map((b, i) => (
                  <Cell key={i} fill={b._color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tren per tahun — tampil kalau ada data lebih dari 1 tahun */}
      {byTahun.length > 1 && (
        <div className="mb-5">
          <ChartCard title="Tren Penerimaan per Tahun" subtitle="Jumlah mahasiswa mendapatkan beasiswa tiap tahun">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byTahun} margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E1D6" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={TT} formatter={(v) => [v, "Penerima"]} />
                <Bar dataKey="count" fill={GREEN} radius={[4, 4, 0, 0]} name="Penerima" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Tabel detail */}
      <ChartCard title="Daftar Penerima Beasiswa" subtitle="Data individual mahasiswa penerima beasiswa">
        <DataTable
          columns={columns}
          rows={tableRows}
          searchKeys={["nim", "nama", "namaBeasiswa", "prodi"]}
          pageSize={10}
        />
      </ChartCard>
    </div>
  );
}
