import TargetGauge from "./TargetGauge.jsx";

export default function StatCard({ icon: Icon, label, value, suffix = "", target, targetUnit = "%", targetMax = 100 }) {
  return (
    <div className="bg-surface border border-line rounded-xl2 p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-inksoft uppercase tracking-wide">{label}</span>
        {Icon && <Icon size={16} className="text-inkfaint flex-shrink-0" strokeWidth={1.8} />}
      </div>
      <div className="mt-2 font-display font-bold text-[2rem] leading-none text-ink tabular">
        {value}
        <span className="text-lg text-inksoft">{suffix}</span>
      </div>
      {target !== undefined && target !== null && (
        <TargetGauge value={Number(value)} target={target} max={targetMax} unit={targetUnit} />
      )}
    </div>
  );
}
