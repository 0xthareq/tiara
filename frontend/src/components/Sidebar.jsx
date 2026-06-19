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
  { to: "/",          label: "Beranda",               icon: LayoutDashboard },
  { to: "/kelulusan", label: "Tracer Study Kelulusan", icon: GraduationCap  },
  { to: "/karier",    label: "Karier Alumni",          icon: Briefcase       },
  { to: "/prestasi",  label: "Prestasi Mahasiswa",     icon: Trophy          },
  { to: "/kegiatan",  label: "Kegiatan & Pertukaran",  icon: Globe           },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 z-40
          h-screen lg:h-full
          w-64 bg-surface border-r border-line
          flex flex-col flex-shrink-0
          transition-transform duration-200 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-line">
          <span className="font-semibold text-ink text-sm">Menu</span>
          <button
            onClick={onClose}
            className="text-inksoft hover:text-ink"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
              <item.icon size={17} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-line">
          <p className="text-[11px] text-inkfaint leading-relaxed">
            Fakultas Matematika dan Ilmu Pengetahuan Alam
            <br />
            Universitas Tanjungpura
          </p>
        </div>
      </aside>
    </>
  );
}
