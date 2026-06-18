import { NavLink } from "react-router-dom";
import { ExternalLink, Map, UserCircle, LayoutGrid } from "lucide-react";

export default function TopHeader() {
  return (
    <header className="bg-surface border-b border-line sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 flex items-center justify-end h-11">
        <nav className="flex items-center gap-1">
          {/* Portal — external link */}
          <a
            href="https://ac-fmipa-portal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-inksoft hover:text-ink hover:bg-paper transition-colors"
          >
            <LayoutGrid size={15} strokeWidth={1.8} />
            Portal
          </a>

          {/* Roadmap — internal page */}
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
            <Map size={15} strokeWidth={1.8} />
            Roadmap
          </NavLink>

          {/* About Me — external link, new tab */}
          <a
            href="https://howlyvine.eth.limo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-inksoft hover:text-ink hover:bg-paper transition-colors"
          >
            <UserCircle size={15} strokeWidth={1.8} />
            About me
            <ExternalLink size={12} className="opacity-50" />
          </a>
        </nav>
      </div>
    </header>
  );
}
