export function ProgressRing({ colorClass = "stroke-brand-primary", value }) {
  const bounded = Math.max(0, Math.min(100, value));
  const circumference = 125.6;
  const dashOffset = circumference - (bounded / 100) * circumference;

  return (
    <div className="relative grid size-14 place-items-center text-[11px] font-extrabold text-brand-text dark:text-white">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
        <circle
          className="fill-none stroke-brand-outline/20 dark:stroke-white/10"
          cx="24"
          cy="24"
          r="20"
          strokeWidth="4"
        />
        <circle
          className={`fill-none ${colorClass} stroke-[4] stroke-linecap-round`}
          cx="24"
          cy="24"
          r="20"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span>{bounded}%</span>
    </div>
  );
}
