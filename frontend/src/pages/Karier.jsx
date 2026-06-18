import { Briefcase } from "lucide-react";
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
import { fetchKarir } from "../lib/api.js";
import { useApiData } from "../lib/useApiData.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataTable, { BuktiLinkCell } from "../components/DataTable.jsx";
import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

const STATUS_COLORS = { Bekerja: "#1E4FDE", Wirausaha: "#2F9E5B", "Lanjut Studi": "#E08A2C", "Belum Bekerja": "#9BA0AC" };
const BUCKET_COLORS = ["#2F9E5B", "#E08A2C", "#9BA0AC"];

export default function Karier() {
  const { data: payload, loading, error, reload } = useApiData(fetchKarir);

  if (loading) return <LoadingState label="Memuat data karier alumni..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, statusCounts, masaTungguBuckets, tableRows } = payload.data;

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "StatusUtama", label: "Status" },
    { key: "MasaTungguBulan", label: "Masa Tunggu (bln)" },
    { key: "RasioGajiUMR", label: "Rasio Gaji/UMR" },
    { key: "InstitusiTujuan", label: "Institusi" },
    {
      key: "MemenuhiIKU1",
      label: "IKU 1",
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            row.MemenuhiIKU1 === "Ya" ? "bg-greensoft text-green" : "bg-paper text-inksoft"
          }`}
        >
          {row.MemenuhiIKU1}
        </span>
      ),
    },
    { key: "BuktiLink", label: "Bukti", render: (row) => <BuktiLinkCell href={row.BuktiLink} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Karier Alumni"
        subtitle="Status bekerja, berwirausaha, atau melanjutkan studi setelah lulus — mengacu pada kriteria masa tunggu dan rasio gaji terhadap UMR."
        demoMode={payload.meta.demoMode}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Briefcase} label="Lulusan Terdata" value={summary.total} />
        <StatCard icon={Briefcase} label="Memenuhi Kriteria IKU 1" value={summary.pctIku1} suffix="%" />
        <StatCard
          icon={Briefcase}
          label="Target Masa Tunggu"
          value={summary.target}
          suffix=" bulan"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <ChartCard title="Status Karier" subtitle="Distribusi status alumni setelah lulus">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusCounts} barSize={42}>
              <CartesianGrid vertical={false} stroke="#E4E1D6" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#5B6172" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                {statusCounts.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#9BA0AC"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Masa Tunggu Kerja" subtitle={`Target: kurang dari ${summary.target} bulan`}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={masaTungguBuckets} barSize={42}>
              <CartesianGrid vertical={false} stroke="#E4E1D6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5B6172" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6172" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                {masaTungguBuckets.map((entry, i) => (
                  <Cell key={entry.label} fill={BUCKET_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={tableRows} searchKeys={["Nama", "NIM", "ProgramStudi", "InstitusiTujuan"]} />
      </div>
    </div>
  );
}
