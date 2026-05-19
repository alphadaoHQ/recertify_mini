import { Icon } from "../../components/Icon";

export function DashboardTab({ stats, isLoading }) {
  if (isLoading || !stats) return <p className="text-slate-400">Loading dashboard…</p>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: "users", color: "from-brand-primary to-brand-primary-bright" },
    { label: "Active Courses", value: stats.totalCourses, icon: "book", color: "from-emerald-500 to-emerald-400" },
    { label: "Active Tasks", value: stats.totalTasks, icon: "send", color: "from-amber-500 to-orange-400" },
    { label: "Whitelist Users", value: stats.whitelistCount, icon: "shield", color: "from-cyan-500 to-blue-400" },
    { label: "Total XP Distributed", value: stats.totalXpDistributed.toLocaleString(), icon: "barChart", color: "from-rose-500 to-pink-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Overview of your Recertify Mini application.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{c.label}</span>
              <div className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.color}`}>
                <Icon className="size-4 text-white" name={c.icon} />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
