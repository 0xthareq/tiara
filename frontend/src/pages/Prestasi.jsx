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
import DataTable, { BuktiLinkCell } from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const CAPAIAN_COLORS = {
  "Juara 1": "#1E4FDE",
  "Juara 2": "#5B7FF0",
  "Juara 3": "#9BB4F7",
  "Harapan 1": "#2AA87A",
  "Harapan 2": "#5EC9A0",
  "Harapan 3": "#A0E4C8",
  Finalis: "#E08A2C",
  Favorit: "#9BA0AC",
};

export default function Prestasi() {
  const { data: payload, loading, error, reload } = useApiData(fetchPrestasi);

  if (loading) return <LoadingState label="Memuat data prestasi mahasiswa..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, matrix, byTingkat, tableRows } = payload.data;

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "NamaKegiatan", label: "Nama Kegiatan/Lomba" },
    { key: "Tingkat", label: "Tingkat" },
    { key: "Capaian", label: "Capaian" },
    { key: "Tahun", label: "Tahun" },
    { key: "BuktiLink", label: "Bukti", render: (row) => <BuktiLinkCell href={row.BuktiLink} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Prestasi Mahasiswa"
        subtitle="Rekap mahasiswa yang meraih prestasi di berbagai tingkat: internasional, nasional, provinsi, universitas, dan fakultas."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Trophy} label="Total Prestasi Tercatat" value={summary.total} />
        {byTingkat.map((t) => (
          <StatCard key={t.tingkat} icon={Trophy} label={`Tingkat ${t.tingkat}`} value={t.jumlah} />
        ))}
      </div>

      <ChartCard
        title="Capaian per Tingkat Kompetisi"
        subtitle="Juara 1, Juara 2/3, finalis, dan favorit pada setiap tingkat"
        className="mt-6"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={matrix} barSize={26}>
            <CartesianGrid vertical={false} stroke="#E4E1D6" />
            <XAxis dataKey="tingkat" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(CAPAIAN_COLORS).map((capaian) => (
              <Bar key={capaian} dataKey={capaian} stackId="a" fill={CAPAIAN_COLORS[capaian]} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchKeys={["Nama", "NIM", "ProgramStudi", "NamaKegiatan"]} />
      </div>
    </div>
  );
}
