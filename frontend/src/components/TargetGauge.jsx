export default function TargetGauge({ value, target, max = 100, unit = "%" }) {
  const safeMax = Math.max(max, value, target, 1);
  const pctValue = Math.min(100, (value / safeMax) * 100);
  const pctTarget = Math.min(100, (target / safeMax) * 100);
  const achieved = value >= target;

  return (
    <div className="mt-3">
      <div className="relative h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
            achieved ? "bg-green" : "bg-amber"
          }`}
          style={{ width: `${pctValue}%` }}
        />
        <div
          className="absolute top-[-3px] bottom-[-3px] w-[2px] bg-ink/50"
          style={{ left: `${pctTarget}%` }}
          title={`Target: ${target}${unit}`}
        />
      </div>
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[11px] text-inkfaint">
          Target {target}
          {unit}
        </span>
        <span
          className={`text-[11px] font-semibold ${achieved ? "text-green" : "text-amber"}`}
        >
          {achieved ? "Tercapai" : "Belum tercapai"}
        </span>
      </div>
    </div>
  );
}
