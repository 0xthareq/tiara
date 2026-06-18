import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-5 py-4 bg-surface border-b border-line sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-ink" aria-label="Buka menu">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-ink">TIARA</span>
        </div>

        <main className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
