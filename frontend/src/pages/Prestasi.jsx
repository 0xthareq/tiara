import { Trophy } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { fetchPrestasi } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const JENIS_COLORS = {
  "Kompetisi": "#1E4FDE",
  "Aktivitas Kemahasiswaan": "#2AA87A",
};

export default function Prestasi() {
  const { data: payload, loading, error, reload } = useApiData(fetchPrestasi);

  if (loading) return <LoadingState label="Memuat data prestasi mahasiswa..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, matrix, byTingkat, jenisAktivitasOrder, tableRows } = payload.data;

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "NamaAktivitas", label: "Nama Aktivitas" },
    { key: "JenisAktivitas", label: "Jenis Aktivitas" },
    { key: "Tingkat", label: "Tingkat" },
    { key: "Tahun", label: "Tahun" },
  ];

  return (
    <div>
      <PageHeader
        title="Prestasi Mahasiswa"
        subtitle="Rekap mahasiswa yang meraih prestasi dan mengikuti aktivitas kemahasiswaan di berbagai tingkat."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Total Tercatat" value={summary.total} />
        {byTingkat.map((t) => (
          <StatCard key={t.tingkat} icon={Trophy} label={t.tingkat} value={t.jumlah} />
        ))}
      </div>

      <ChartCard
        title="Sebaran per Tingkat"
        subtitle="Breakdown kompetisi vs aktivitas kemahasiswaan pada setiap tingkat"
        className="mt-6"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={matrix} barSize={26}>
            <CartesianGrid vertical={false} stroke="#E4E1D6" />
            <XAxis dataKey="tingkat" tick={{ fontSize: 11, fill: "#5B6172" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {jenisAktivitasOrder.map((jenis) => (
              <Bar key={jenis} dataKey={jenis} stackId="a" fill={JENIS_COLORS[jenis] || "#9BA0AC"} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchKeys={["Nama", "NIM", "ProgramStudi", "NamaAktivitas"]} />
      </div>
    </div>
  );
}