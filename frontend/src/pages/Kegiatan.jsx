import { Globe, Repeat } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { fetchKegiatan } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataTable, { BuktiLinkCell } from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const SKS_COLORS = ["#9BA0AC", "#E08A2C", "#2F9E5B"];

export default function Kegiatan() {
  const { data: payload, loading, error, reload } = useApiData(fetchKegiatan);

  if (loading) return <LoadingState label="Memuat data kegiatan luar kampus..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, byJenisKegiatan, sksBuckets, tableRows } = payload.data;

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "JenisKegiatan", label: "Jenis Kegiatan" },
    { key: "JumlahSKS", label: "SKS" },
    { key: "Mitra", label: "Mitra" },
    { key: "Periode", label: "Periode" },
    { key: "BuktiLink", label: "Bukti", render: (row) => <BuktiLinkCell href={row.BuktiLink} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Kegiatan & Pertukaran Mahasiswa"
        subtitle="Rekap kegiatan pembelajaran mahasiswa di luar kampus, termasuk program pertukaran mahasiswa dan konversi SKS."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard icon={Globe} label="Total Kegiatan Tercatat" value={summary.total} />
        <StatCard icon={Repeat} label="Program Pertukaran Mahasiswa" value={summary.totalPertukaran} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <ChartCard title="Jenis Kegiatan" subtitle="Ragam bentuk kegiatan pembelajaran di luar kampus" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byJenisKegiatan} layout="vertical" barSize={20} margin={{ left: 24 }}>
              <CartesianGrid horizontal={false} stroke="#E4E1D6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="jenis" type="category" tick={{ fontSize: 11, fill: "#5B6172" }} axisLine={false} tickLine={false} width={170} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#1E4FDE" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribusi SKS Diakui" subtitle="Jumlah SKS yang dikonversi dari kegiatan luar kampus" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sksBuckets} barSize={48}>
              <CartesianGrid vertical={false} stroke="#E4E1D6" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                {sksBuckets.map((entry, i) => (
                  <Cell key={entry.label} fill={SKS_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchKeys={["Nama", "NIM", "ProgramStudi", "Mitra"]} />
      </div>
    </div>
  );
}
