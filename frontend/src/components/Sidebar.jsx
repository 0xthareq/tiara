import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Trophy,
  Globe,
  X,
  Landmark,
  Users,
} from "lucide-react";

const NAV_MONITORING = [
  { to: "/dashboard",           label: "Beranda",               icon: LayoutDashboard },
  { to: "/dashboard/kelulusan", label: "Tracer Study Kelulusan", icon: GraduationCap  },
  { to: "/dashboard/karier",    label: "Karier Alumni",          icon: Briefcase       },
  { to: "/dashboard/prestasi",  label: "Prestasi Mahasiswa",     icon: Trophy          },
  { to: "/dashboard/kegiatan",  label: "Kegiatan & Pertukaran",  icon: Globe           },
];

const NAV_DATA = [
  { to: "/dashboard/beasiswa",  label: "Data Beasiswa",          icon: Landmark        },
  { to: "/dashboard/mahasiswa", label: "Data Lulusan Mahasiswa",         icon: Users           },
];

function NavItem({ item, onClose }) {
  return (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === "/dashboard"}
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
  );
}

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
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {/* Monitoring section */}
          {NAV_MONITORING.map((item) => (
            <NavItem key={item.to} item={item} onClose={onClose} />
          ))}

          {/* Divider + Data section */}
          <div className="pt-3 pb-1">
            <div className="flex items-center gap-2 px-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-inkfaint">
                Data
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>
          </div>

          {NAV_DATA.map((item) => (
            <NavItem key={item.to} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-line">
          <p className="text-[11px] text-inkfaint leading-relaxed">
            Fakultas MIPA
            <br />
            Universitas Tanjungpura
          </p>
        </div>
      </aside>
    </>
  );
}
