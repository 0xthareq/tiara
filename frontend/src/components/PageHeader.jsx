import { FlaskConical } from "lucide-react";

export default function PageHeader({ title, subtitle, demoMode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-inksoft mt-1 max-w-xl">{subtitle}</p>}
      </div>
      {demoMode && (
        <div className="flex items-center gap-1.5 bg-ambersoft text-amber text-xs font-semibold px-3 py-1.5 rounded-full">
          <FlaskConical size={13} />
          Mode Demo &mdash; data contoh
        </div>
      )}
    </div>
  );
}
