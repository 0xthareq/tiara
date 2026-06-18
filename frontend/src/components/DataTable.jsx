import { useMemo, useState } from "react";
import { Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export function BuktiLinkCell({ href }) {
  if (!href) return <span className="text-inkfaint">&mdash;</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-azure hover:text-azuredeep font-medium"
    >
      Lihat <ExternalLink size={12} />
    </a>
  );
}

export default function DataTable({ columns, rows, searchKeys = [], pageSize = 8, emptyLabel = "Belum ada data." }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) => searchKeys.some((key) => String(row[key] || "").toLowerCase().includes(q)));
  }, [rows, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  return (
    <div className="bg-surface border border-line rounded-xl2 shadow-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-inkfaint" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Cari nama, NIM, atau program studi..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-line bg-paper focus:outline-none focus:ring-2 focus:ring-azure/30 focus:border-azure"
          />
        </div>
        <span className="text-xs text-inkfaint flex-shrink-0">{filtered.length} baris</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-inkfaint border-b border-line">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-inkfaint text-sm">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {paginated.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-0 hover:bg-paper/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 text-ink whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key] || <span className="text-inkfaint">&mdash;</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-line text-xs text-inksoft">
          <span>
            Halaman {currentPage + 1} dari {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-paper"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="p-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-paper"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
