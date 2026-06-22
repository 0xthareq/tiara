import { Users, GraduationCap, Trophy, Globe, Repeat } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchOverview } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const STATUS_COLORS = { Bekerja: "#1E4FDE", Wirausaha: "#2F9E5B", "Lanjut Studi": "#E08A2C", "Belum Bekerja": "#9BA0AC" };
const TINGKAT_COLORS = {
  Internasional: "#1E4FDE",
  Nasional: "#2F9E5B",
  Provinsi: "#E08A2C",
  Universitas: "#9B59B6",
  Fakultas: "#E74C3C",
};

export default function Overview() {
  const { data: payload, loading, error, reload } = useApiData(fetchOverview);

  if (loading) return <LoadingState label="Memuat ringkasan dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const d = payload.data;

  return (
    <div>
      <PageHeader
        title="Beranda"
        subtitle="Ringkasan tracer study, informasi alumni, dan prestasi mahasiswa FMIPA Universitas Tanjungpura."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Alumni Terdata" value={d.totalAlumniTerdata} />
        <StatCard
          icon={GraduationCap}
          label="Rata-rata Lulus Tepat Waktu"
          value={d.tepatWaktuRataRata}
          suffix="%"
          target={80}
        />
        <StatCard icon={Trophy} label="Prestasi Mahasiswa" value={d.totalPrestasi} />
        <StatCard icon={Globe} label="Kegiatan Luar Kampus" value={d.totalKegiatanLuarKampus} />
        <StatCard icon={Repeat} label="Program Pertukaran Mahasiswa" value={d.totalPertukaranMahasiswa} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <ChartCard title="Kelulusan Tepat Waktu per Jenjang" subtitle="Capaian dibandingkan target resmi fakultas">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.tracerStudySummary} barSize={48}>
              <CartesianGrid vertical={false} stroke="#E4E1D6" />
              <XAxis dataKey="jenjang" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" name="Lulus tepat waktu" fill="#1E4FDE" radius={[6, 6, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#E4E1D6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status Karier Alumni" subtitle="Bekerja, wirausaha, lanjut studi, atau belum bekerja">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={d.statusCounts}
                dataKey="jumlah"
                nameKey="status"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {d.statusCounts.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#9BA0AC"} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Prestasi Mahasiswa per Tingkat"
          subtitle="Internasional, nasional, dan provinsi"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.byTingkatPrestasi} layout="vertical" barSize={28}>
              <CartesianGrid horizontal={false} stroke="#E4E1D6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="tingkat" type="category" tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip />
              <Bar dataKey="jumlah" radius={[0, 6, 6, 0]}>
                {d.byTingkatPrestasi.map((entry) => (
                  <Cell key={entry.tingkat} fill={TINGKAT_COLORS[entry.tingkat] || "#1E4FDE"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
