import { Icon } from "./Icon";

const tabs = [
  { id: "learning", label: "Learning", icon: "book" },
  { id: "tasks", label: "Tasks", icon: "send" },
  { id: "ranks", label: "Ranks", icon: "trophy" },
  { id: "profile", label: "Profile", icon: "account" },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid w-[min(calc(100%-20px),440px)] grid-cols-4 gap-2 rounded-t-[2rem] border border-white/30 bg-white/75 p-3 shadow-[0_-10px_34px_rgba(129,39,207,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.16em] transition ${
              active
                ? "bg-brand-primary-soft/80 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft"
                : "text-brand-muted/75 hover:bg-brand-primary-soft/40 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-brand-primary-soft"
            }`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <Icon className="size-5" name={tab.icon} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
