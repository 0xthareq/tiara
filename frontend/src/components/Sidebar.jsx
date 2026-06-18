import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Trophy,
  Globe,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Beranda", icon: LayoutDashboard },
  { to: "/kelulusan", label: "Tracer Study Kelulusan", icon: GraduationCap },
  { to: "/karier", label: "Karier Alumni", icon: Briefcase },
  { to: "/prestasi", label: "Prestasi Mahasiswa", icon: Trophy },
  { to: "/kegiatan", label: "Kegiatan & Pertukaran", icon: Globe },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-surface border-r border-line z-40
        flex flex-col transition-transform duration-200 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azure flex items-center justify-center font-display font-bold text-white text-sm">
              TS
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight text-ink">TIARA</div>
              <div className="text-[11px] text-inksoft leading-tight">
                Tracer Study &amp; Prestasi Mahasiswa
              </div>
            </div>
          </div>
          <button className="lg:hidden text-inksoft" onClick={onClose} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-azuresoft text-azuredeep"
                    : "text-inksoft hover:bg-paper hover:text-ink"
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-line">
          <div className="text-[11px] text-inkfaint leading-relaxed">
            Fakultas Matematika dan Ilmu Pengetahuan Alam
            <br />
            Universitas Tanjungpura
          </div>
        </div>
      </aside>
    </>
  );
}
