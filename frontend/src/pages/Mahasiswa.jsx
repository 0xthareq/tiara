// import { useState } from "react";
// import { Users, ChevronDown, FlaskConical } from "lucide-react";
// import {
//   ResponsiveContainer, BarChart, Bar,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// } from "recharts";
// import { fetchMahasiswa } from "../lib/api.js";
// import { useApiData } from "../lib/useApiData.js";
// import StatCard from "../components/StatCard.jsx";
// import ChartCard from "../components/ChartCard.jsx";
// import DataTable from "../components/DataTable.jsx";
// import { LoadingState, ErrorState } from "../components/StatusStates.jsx";

// const PRODI_SHORT = {
//   "MATEMATIKA":               "Matematika",
//   "FISIKA":                   "Fisika",
//   "KIMIA":                    "Kimia",
//   "BIOLOGI":                  "Biologi",
//   "REKAYASA SISTEM KOMPUTER": "RSK",
//   "GEOFISIKA":                "Geofisika",
//   "ILMU KELAUTAN":            "Ilmu Kelautan",
//   "STATISTIKA":               "Statistika",
//   "SISTEM INFORMASI":         "Sistem Informasi",
//   "S2 KIMIA":                 "S2 Kimia",
// };

// const C = { p1: "#1E4FDE", p2: "#2F9E5B", p3: "#E08A2C", p4: "#7C3AED" };
// const TT = { fontSize: 12, borderRadius: 8, border: "1px solid #E4E1D6", boxShadow: "0 2px 8px rgba(0,0,0,.06)" };

// export default function Mahasiswa() {
//   const { data: payload, loading, error, reload } = useApiData(fetchMahasiswa);
//   const [activeTahun, setActiveTahun] = useState(null);

//   if (loading) return <LoadingState label="Memuat data lulusan..." />;
//   if (error)   return <ErrorState message={error.message} onRetry={reload} />;

//   const { summary, allYears } = payload.data;
//   const tahunOptions   = allYears.map((y) => y.tahunAjar);
//   const selectedTahun  = activeTahun ?? tahunOptions[0] ?? null;
//   const activeYear     = allYears.find((y) => y.tahunAjar === selectedTahun) ?? allYears[0];
//   const rows           = activeYear?.rows ?? [];

//   const totalP1 = rows.reduce((s, r) => s + r.periode1, 0);
//   const totalP2 = rows.reduce((s, r) => s + r.periode2, 0);
//   const totalP3 = rows.reduce((s, r) => s + r.periode3, 0);
//   const totalP4 = rows.reduce((s, r) => s + (r.periode4 ?? 0), 0);

//   const chartData = [...rows]
//     .sort((a, b) => a.total - b.total)
//     .map((r) => ({
//       prodi:      PRODI_SHORT[r.prodi] ?? r.prodi,
//       "Periode 1": r.periode1,
//       "Periode 2": r.periode2,
//       "Periode 3": r.periode3,
//       "Periode 4": r.periode4 ?? 0,
//     }));

//   const trendData = [...summary.byTahun].reverse();

//   const columns = [
//     { key: "prodi",    label: "Program Studi" },
//     { key: "periode1", label: "Periode 1" },
//     { key: "periode2", label: "Periode 2" },
//     { key: "periode3", label: "Periode 3" },
//     { key: "periode4", label: "Periode 4", render: (r) => r.periode4 ?? 0 },
//     { key: "total", label: "Total", render: (r) => <span className="font-semibold text-ink tabular">{r.total}</span> },
//   ];

//   return (
//     <div>
//       {/* Header + selector */}
//       <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
//         <div>
//           <h1 className="font-display font-bold text-2xl text-ink">Data Lulusan</h1>
//           <p className="text-sm text-inksoft mt-1 max-w-xl">
//             Rekap lulusan FMIPA per program studi dan periode wisuda.
//           </p>
//         </div>
//         <div className="flex items-center gap-2.5">
//           {payload.meta.demoMode && (
//             <span className="flex items-center gap-1.5 bg-ambersoft text-amber text-xs font-semibold px-3 py-1.5 rounded-full">
//               <FlaskConical size={13} /> Mode Demo
//             </span>
//           )}
//           {tahunOptions.length > 0 && (
//             <div className="relative">
//               <select
//                 value={selectedTahun ?? ""}
//                 onChange={(e) => setActiveTahun(e.target.value)}
//                 className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-line bg-surface text-sm font-medium text-ink shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-azure/30"
//               >
//                 {tahunOptions.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-inkfaint" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* StatCards - 5 kolom */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
//         <StatCard icon={Users} label={`Total ${selectedTahun ?? ""}`} value={activeYear?.total ?? 0} />
//         <StatCard label="Periode 1" value={totalP1} suffix=" orang" />
//         <StatCard label="Periode 2" value={totalP2} suffix=" orang" />
//         <StatCard label="Periode 3" value={totalP3} suffix=" orang" />
//         <StatCard label="Periode 4" value={totalP4} suffix=" orang" />
//       </div>

//       {/* Charts */}
//       <div className={`grid gap-5 mb-5 ${trendData.length > 1 ? "lg:grid-cols-2" : ""}`}>
//         <ChartCard title={`Lulusan per Prodi - ${selectedTahun ?? ""}`} subtitle="Stacked per periode wisuda">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E1D6" />
//               <XAxis type="number" tick={{ fontSize: 11 }} />
//               <YAxis type="category" dataKey="prodi" width={108} tick={{ fontSize: 11 }} />
//               <Tooltip contentStyle={TT} />
//               <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
//               <Bar dataKey="Periode 1" stackId="a" fill={C.p1} />
//               <Bar dataKey="Periode 2" stackId="a" fill={C.p2} />
//               <Bar dataKey="Periode 3" stackId="a" fill={C.p3} />
//               <Bar dataKey="Periode 4" stackId="a" fill={C.p4} radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {trendData.length > 1 && (
//           <ChartCard title="Tren Total Lulusan" subtitle="Perbandingan antar tahun ajar">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={trendData} margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E1D6" />
//                 <XAxis dataKey="tahunAjar" tick={{ fontSize: 11 }} />
//                 <YAxis tick={{ fontSize: 11 }} />
//                 <Tooltip contentStyle={TT} />
//                 <Bar dataKey="total" fill={C.p1} radius={[4, 4, 0, 0]} name="Total Lulusan" />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         )}
//       </div>

//       {/* Tabel detail */}
//       <ChartCard title={`Rincian per Program Studi - ${selectedTahun ?? ""}`} subtitle="Breakdown lulusan per periode wisuda">
//         <DataTable columns={columns} rows={rows} searchKeys={["prodi"]} pageSize={15} />
//       </ChartCard>
//     </div>
//   );
// }
import { Construction } from "lucide-react";

export default function Mahasiswa() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Data Lulusan</h1>
        <p className="text-sm text-inksoft mt-1 max-w-xl">
          Rekap lulusan FMIPA per program studi dan periode wisuda.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-ambersoft rounded-full p-5 mb-5">
          <Construction size={36} className="text-amber" />
        </div>
        <h2 className="text-xl font-semibold text-ink mb-2">Sedang dalam Pengembangan</h2>
        <p className="text-sm text-muted max-w-sm">
          Halaman ini sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
      </div>
    </div>
  );
}
