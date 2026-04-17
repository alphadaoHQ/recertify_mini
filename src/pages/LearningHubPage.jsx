import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";

export function LearningHubPage({ isLoading, isWalletConnected, modules, onOpenModule, recentMint, user }) {
  const navigate = useNavigate();
  const completedCount = modules.filter((module) => module.progress?.completed).length;

  return (
    <div className="grid gap-6 pb-4">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-primary-bright p-7 text-white shadow-ambient">
        <div className="absolute top-5 right-5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]">
          {user.streakXp} XP earned
        </div>
        <div className="absolute -right-8 -bottom-8 size-36 rounded-full bg-white/10 blur-2xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">Immutable Artifacts</p>
        <h1 className="mt-3 font-display text-[1.35rem] leading-[0.95] font-extrabold tracking-[-0.04em]">
          Master blockchain protocols and earn verified credentials on-chain.
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/90">
          Connect your wallet, finish learning modules, and claim task rewards tied directly to your profile.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em]">
            {completedCount}/{modules.length} modules complete
          </span>
          <span className="rounded-full bg-white/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em]">
            {isWalletConnected ? "Wallet linked" : "Connect wallet to save"}
          </span>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Ecosystem Quests</h2>
          <button
            className="text-sm font-bold text-brand-primary dark:text-brand-primary-soft"
            onClick={() => navigate("/ranks")}
            type="button"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
          {modules.map((module) => {
            const completed = module.progress?.completed;
            const answered = Boolean(module.progress?.selected_answer);

            return (
              <article
                className="overflow-hidden rounded-[1.75rem] border border-white/50 bg-white/75 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                key={module.id}
              >
                <div className="relative h-28 overflow-hidden">
                  <img alt={module.title} className="h-full w-full object-cover" src={module.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-text/65 via-brand-text/15 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                    <Icon className="size-5" name={module.icon} />
                  </div>
                  <div className="absolute right-3 bottom-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {completed ? "Completed" : answered ? "In Progress" : "New"}
                  </div>
                </div>
                <div className="grid gap-3 p-4">
                  <div>
                    <h3 className="font-display text-base font-extrabold tracking-[-0.03em] text-brand-text dark:text-white">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">{module.subtitle}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary dark:text-brand-primary-soft">
                      Reward: {module.rewardXp} XP
                    </p>
                  </div>
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-primary/20"
                    onClick={() => onOpenModule(module.id)}
                    type="button"
                  >
                    {completed ? "Review Module" : answered ? "Resume Module" : "Learn & Earn"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex items-center gap-4 rounded-[2rem] bg-brand-surface-soft/90 p-4 shadow-float backdrop-blur-xl dark:bg-white/6">
        <div className="inline-flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-white text-brand-primary shadow-sm dark:bg-white/10 dark:text-brand-primary-soft">
          <Icon className="size-7" name="book" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">
            {isLoading ? "Loading your latest reward..." : recentMint.title}
          </h3>
          <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">{recentMint.completedAt}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-outline/15 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-emerald-400"
              style={{ width: `${Math.max((completedCount / modules.length) * 100, 6)}%` }}
            />
          </div>
        </div>
        <div className="text-brand-secondary dark:text-emerald-300">
          <Icon className="size-6" name="check" />
        </div>
      </section>
    </div>
  );
}
