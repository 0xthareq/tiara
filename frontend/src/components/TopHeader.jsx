import { NavLink } from "react-router-dom";
import { ExternalLink, Map, LayoutGrid, Menu } from "lucide-react";

export default function TopHeader({ onMenuOpen }) {
  return (
    <header className="bg-surface border-b border-line sticky top-0 z-50 flex-shrink-0">
      <div className="px-4 sm:px-6 flex items-center justify-between h-16">

        {/* LEFT — Mobile hamburger + Logos + Institution name */}
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden text-inksoft hover:text-ink p-1 -ml-1"
            onClick={onMenuOpen}
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>

          {/* Logos */}
          <div className="flex items-center gap-1.5">
            <img
              src="/untan-logo.png"
              alt="Logo Universitas Tanjungpura"
              className="h-10 w-10 object-contain"
            />
            <img
              src="/tiara-logo.png"
              alt="Logo TIARA"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-9 bg-line" />

          {/* Institution name */}
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-ink tracking-tight">
              Fakultas MIPA
            </div>
            <div className="text-[12px] font-serif italic text-inksoft">
              Universitas Tanjungpura
            </div>
          </div>
        </div>

        {/* RIGHT — Navigation links */}
        <nav className="flex items-center gap-0.5">
          <a
            href="https://ac-fmipa-portal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-inksoft hover:text-ink hover:bg-paper transition-colors"
          >
            <LayoutGrid size={14} strokeWidth={1.8} />
            <span className="hidden sm:inline">Portal</span>
          </a>

          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-azure bg-azuresoft"
                  : "text-inksoft hover:text-ink hover:bg-paper"
              }`
            }
          >
            <Map size={14} strokeWidth={1.8} />
            <span className="hidden sm:inline">Roadmap</span>
          </NavLink>

          <a
            href="https://howlyvine.eth.limo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-inksoft hover:text-ink hover:bg-paper transition-colors"
          >
            <span className="hidden sm:inline">About me</span>
            <ExternalLink size={13} className="opacity-60" />
          </a>
        </nav>

      </div>
    </header>
  );
}
