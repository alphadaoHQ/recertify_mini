import { useState } from "react";
import { Icon } from "../../components/Icon";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "tasks", label: "Tasks", icon: "send" },
  { id: "users", label: "Users", icon: "users" },
  { id: "whitelist", label: "Whitelist", icon: "shield" },
];

export function AdminLayout({ activeTab, onSwitchTab, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabSwitch = (tabId) => {
    onSwitchTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Mobile Header Bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-slate-900/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <Icon className="size-5" name="menu" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-bright">
            <Icon className="size-3.5 text-white" name="shield" />
          </div>
          <p className="font-display text-sm font-extrabold text-white">
            Recertify Admin
          </p>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-bright">
              <Icon className="size-5 text-white" name="shield" />
            </div>
            <div>
              <p className="font-display text-sm font-extrabold text-white">
                Recertify
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <Icon className="size-4" name="x" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSwitch(tab.id)}
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
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Icon className="size-4.5" name="logout" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="w-full flex-1 px-4 pb-6 pt-16 md:ml-60 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
