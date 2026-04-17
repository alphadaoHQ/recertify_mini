import { Icon } from "../components/Icon";

export function TasksPage({ isWalletConnected, onClaimSpecialQuest, onClaimTask, specialQuest, tasks }) {
  const claimedTaskCount = tasks.filter((task) => task.claimed).length;

  return (
    <div className="grid gap-6 pb-4">
      <section className="rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-primary-bright p-7 text-white shadow-ambient">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">Quest rewards available</p>
        <h1 className="mt-2 font-display text-[2.3rem] font-extrabold tracking-[-0.04em]">
          {tasks.reduce((sum, task) => sum + task.rewardXp, 0) + specialQuest.rewardXp} XP
        </h1>
        <p className="mt-3 max-w-[28ch] text-sm leading-6 text-white/90">
          Complete daily actions, claim your wallet-linked rewards, and unlock the ambassador bonus quest.
        </p>
        <div className="mt-5 rounded-full bg-white/12 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] w-fit">
          {claimedTaskCount}/{tasks.length} tasks claimed
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Daily</h2>
          <span className="rounded-full bg-brand-primary-soft/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
            Wallet Scoped
          </span>
        </div>
        <div className="grid gap-3">
          {tasks.slice(0, 2).map((task) => (
            <article
              className="flex items-center justify-between gap-4 rounded-[1.7rem] bg-white/75 p-4 shadow-float backdrop-blur-xl dark:bg-white/5"
              key={task.id}
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex size-11 items-center justify-center rounded-full bg-brand-primary-soft/60 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                  <Icon className="size-5" name={task.icon} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">{task.title}</h3>
                  <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">{task.description}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary dark:text-brand-primary-soft">
                    {task.reward} - {task.claimed ? "Claimed" : task.status}
                  </p>
                </div>
              </div>
              <button
                className="rounded-full bg-brand-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-primary-bright"
                disabled={!isWalletConnected || task.claimed}
                onClick={() => onClaimTask(task.id)}
                type="button"
              >
                {task.ctaLabel}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-brand-surface-soft/95 p-6 shadow-float dark:bg-white/6">
        <img
          alt={specialQuest.title}
          className="absolute inset-0 h-full w-full object-cover opacity-15 dark:opacity-10"
          src={specialQuest.image}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-brand-surface-soft/70 to-brand-primary-soft/55 dark:from-slate-950/75 dark:via-slate-900/50 dark:to-brand-primary/15" />
        <div className="relative z-10 grid gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-gold-soft/90 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-tertiary">
            <Icon className="size-4" name="star" />
            Premium Quest
          </div>
          <div>
            <h2 className="font-display text-[1.7rem] font-extrabold tracking-[-0.04em] text-brand-text dark:text-white">
              {specialQuest.title}
            </h2>
            <p className="mt-2 max-w-[34ch] text-sm leading-6 text-brand-muted dark:text-slate-300">
              {specialQuest.copy}
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-brand-muted dark:text-slate-300">
              {specialQuest.requirements.map((requirement) => (
                <li className="flex items-center gap-2" key={requirement}>
                  <Icon className="size-4 text-brand-secondary dark:text-emerald-300" name="check" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-4 max-[420px]:flex-col max-[420px]:items-start">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary dark:bg-emerald-500/15 dark:text-emerald-300">
                {specialQuest.reward}
              </span>
              <span className="rounded-full bg-brand-primary-soft/80 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                {specialQuest.bonus}
              </span>
            </div>
            <button
              className="rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isWalletConnected || specialQuest.claimed}
              onClick={onClaimSpecialQuest}
              type="button"
            >
              {specialQuest.claimed ? "Already Claimed" : "Claim Special Quest"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        {tasks.slice(2).map((task) => (
          <article
            className="flex items-center justify-between gap-4 rounded-[1.7rem] bg-white/75 p-4 shadow-float backdrop-blur-xl dark:bg-white/5"
            key={task.id}
          >
            <div className="flex items-center gap-4">
              <div className="inline-flex size-11 items-center justify-center rounded-full bg-brand-primary-soft/60 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                <Icon className="size-5" name={task.icon} />
              </div>
              <div>
                <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">{task.title}</h3>
                <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">{task.description}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary dark:text-brand-primary-soft">
                  {task.reward} - {task.claimed ? "Claimed" : task.status}
                </p>
              </div>
            </div>
            <button
              className="rounded-full bg-brand-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-primary-bright"
              disabled={!isWalletConnected || task.claimed}
              onClick={() => onClaimTask(task.id)}
              type="button"
            >
              {task.ctaLabel}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
