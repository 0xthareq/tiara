import { useState, useCallback } from "react";
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
// length current year -2018 barti mulai 2018 dropdownnya
const currentYear = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: currentYear - 2018}, (_, i) => currentYear - i);

export default function Karier() {
  const [tahunPelaporan, setTahunPelaporan] = useState(String(currentYear));

  const { data: payload, loading, error, reload } = useApiData(
    useCallback(() => fetchKarir(tahunPelaporan), [tahunPelaporan])
  );

  if (loading) return <LoadingState label="Memuat data karier alumni..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const { summary, statusCounts, masaTungguBuckets, tableRows } = payload.data;
  const tahunLulus = String(Number(tahunPelaporan) - 1);

  const columns = [
    { key: "NIM", label: "NIM" },
    { key: "Nama", label: "Nama" },
    { key: "ProgramStudi", label: "Program Studi" },
    { key: "TahunLulus", label: "Tahun Lulus" },
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
        subtitle={`Skor IKU 1 alumni yang lulus tahun ${tahunLulus} - bekerja layak, wirausaha, atau melanjutkan studi sesuai standar Kemendikti Saintek.`}
        demoMode={payload.meta.demoMode}
      />

      {/* Dropdown Tahun Pelaporan */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-inksoft">Tahun Pelaporan</label>
        <select
          value={tahunPelaporan}
          onChange={(e) => setTahunPelaporan(e.target.value)}
          className="text-sm border border-line rounded-lg px-3 py-1.5 bg-surface text-ink focus:outline-none focus:border-azure"
        >
          {TAHUN_OPTIONS.map((y) => (
            <option key={y} value={String(y)}>
              {y} <span className="text-inksoft">(alumni lulus {y - 1})</span>
            </option>
          ))}
        </select>
        <span className="text-xs text-inksoft">
          Menampilkan alumni yang lulus tahun {tahunLulus}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Briefcase} label={`Lulusan ${tahunLulus} Terdata`} value={summary.total} />
        <StatCard icon={Briefcase} label="Skor IKU 1" value={summary.pctIku1} suffix="%" />
        <StatCard
          icon={Briefcase}
          label="Target Masa Tunggu"
          value={summary.target}
          suffix=" bulan"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <ChartCard title="Status Karier" subtitle={`Distribusi status alumni lulus ${tahunLulus}`}>
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