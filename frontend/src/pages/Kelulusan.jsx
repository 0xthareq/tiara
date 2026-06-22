import { GraduationCap } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { fetchTracerStudy } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

export default function Kelulusan() {
  const { data: payload, loading, error, reload } = useApiData(fetchTracerStudy);

  if (loading) return <LoadingState label="Memuat data kelulusan..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, trend, tableRows } = payload.data;

  const trendByYear = {};
  trend.forEach((t) => {
    if (!trendByYear[t.tahun]) trendByYear[t.tahun] = { tahun: t.tahun };
    trendByYear[t.tahun][t.jenjang] = t.pct;
  });
  const trendData = Object.values(trendByYear).sort((a, b) => (a.tahun > b.tahun ? 1 : -1));

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "Jenjang", label: "Jenjang" },
    { key: "TahunMasuk", label: "Tahun Masuk" },
    { key: "TahunLulus", label: "Tahun Lulus" },
    {
      key: "LulusTepatWaktu",
      label: "Tepat Waktu",
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            row.LulusTepatWaktu === "Ya" ? "bg-greensoft text-green" : "bg-ambersoft text-amber"
          }`}
        >
          {row.LulusTepatWaktu}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tracer Study Kelulusan Tepat Waktu"
        subtitle="Mengukur proporsi lulusan sarjana dan magister yang menyelesaikan studi sesuai masa studi yang ditetapkan."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {summary.map((s) => (
          <StatCard
            key={s.jenjang}
            icon={GraduationCap}
            label={`Lulus Tepat Waktu - ${s.jenjang}`}
            value={s.pct}
            suffix="%"
            target={s.target}
          />
        ))}
      </div>

      <ChartCard
        title="Tren Kelulusan Tepat Waktu per Tahun"
        subtitle="Persentase lulusan tepat waktu, dipecah berdasarkan jenjang"
        className="mt-4"
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid vertical={false} stroke="#E4E1D6" />
            <XAxis dataKey="tahun" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="linear" dataKey="S1" name="Sarjana (S1)" stroke="#1E4FDE" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="linear" dataKey="S2" name="Magister (S2)" stroke="#E08A2C" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchKeys={["Nama", "NIM", "ProgramStudi"]} />
      </div>
    </div>
  );
}
