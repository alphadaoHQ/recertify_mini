import { Icon } from "../../components/Icon";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "tasks", label: "Tasks", icon: "send" },
  { id: "users", label: "Users", icon: "users" },
  { id: "whitelist", label: "Whitelist", icon: "shield" },
];

export function AdminLayout({ activeTab, onSwitchTab, onLogout, children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-bright">
            <Icon className="size-5 text-white" name="shield" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-white">Recertify</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id} type="button" onClick={() => onSwitchTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-brand-primary/15 text-brand-primary-soft"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="size-4.5" name={tab.icon} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300">
            <Icon className="size-4.5" name="logout" />
            Sign Out
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}
