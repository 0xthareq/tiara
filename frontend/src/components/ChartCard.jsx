export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-surface border border-line rounded-xl2 p-5 shadow-card ${className}`}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-ink text-[15px]">{title}</h3>
        {subtitle && <p className="text-xs text-inksoft mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
