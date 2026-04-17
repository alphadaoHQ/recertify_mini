import { Icon } from "../components/Icon";
import { ProgressRing } from "../components/ProgressRing";

export function ProfilePage({ isWalletConnected, nfts, progress, tasks, user }) {
  const progressPercent = user.xp + user.xpToNextRank > 0 ? Math.round((user.xp / (user.xp + user.xpToNextRank)) * 100) : 0;
  const claimedTasks = tasks.filter((task) => task.claimed).length;

  return (
    <div className="grid gap-6 pb-4">
      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4 max-[420px]:flex-col max-[420px]:items-start">
          <div>
            <h1 className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.05em] text-brand-text dark:text-white">
              {user.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-brand-muted dark:text-slate-300">
              <span className="rounded-full bg-emerald-100 px-3 py-2 font-extrabold uppercase tracking-[0.14em] text-brand-secondary dark:bg-emerald-500/15 dark:text-emerald-300">
                Level {user.level}
              </span>
              <span className="font-medium uppercase tracking-[0.1em]">{user.title}</span>
              <span className="rounded-full bg-brand-primary-soft/80 px-3 py-2 font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                {isWalletConnected ? "Wallet Profile" : "Guest Mode"}
              </span>
            </div>
          </div>
          <div className="text-right max-[420px]:text-left">
            <div className="font-display text-3xl font-extrabold tracking-[-0.04em] text-brand-primary dark:text-brand-primary-soft">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-muted dark:text-slate-300">
              Total XP
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-[420px]:grid-cols-1">
          <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-float dark:bg-white/5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
              Weekly XP
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-text dark:text-white">
              {user.weeklyXp.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-float dark:bg-white/5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
              Tasks Claimed
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-text dark:text-white">
              {claimedTasks}/{tasks.length}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-float dark:bg-white/5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
              Rank
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-text dark:text-white">
              {user.rank ?? "-"}
            </p>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-brand-outline/15 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
          <span>Next Rank: {user.nextRank}</span>
          <span>{user.xpToNextRank.toLocaleString()} XP to go</span>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Course Progress</h2>
          <button className="text-sm font-bold text-brand-primary dark:text-brand-primary-soft" type="button">
            Wallet Stats
          </button>
        </div>
        <div className="grid gap-3">
          {progress.map((item) => (
            <article
              className="flex items-center justify-between gap-4 rounded-[1.7rem] bg-white/75 p-4 shadow-float backdrop-blur-xl dark:bg-white/5"
              key={item.id}
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-brand-primary-soft/60 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                  <Icon className="size-5" name={item.icon} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">{item.detail}</p>
                </div>
              </div>
              <ProgressRing colorClass={item.color} value={item.percent} />
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Earned NFTs</h2>
          <span className="rounded-full bg-brand-primary-soft/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
            {nfts.filter((item) => !item.locked).length} collected
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-[420px]:grid-cols-1">
          {nfts.map((item) => (
            <article
              className={`overflow-hidden rounded-[1.8rem] p-3 shadow-float backdrop-blur-xl ${
                item.locked ? "bg-brand-surface-high/80 dark:bg-white/5" : "bg-white/75 dark:bg-white/5"
              }`}
              key={item.id}
            >
              <div
                className={`relative flex h-40 items-center justify-center overflow-hidden rounded-[1.35rem] ${
                  item.locked
                    ? "bg-brand-surface-soft dark:bg-slate-900/70"
                    : "bg-gradient-to-br from-brand-primary-soft to-white dark:from-brand-primary/20 dark:to-slate-900"
                }`}
              >
                {item.locked ? (
                  <Icon className="size-10 text-brand-muted dark:text-slate-400" name="lock" />
                ) : (
                  <>
                    <img alt={item.title} className="absolute inset-0 h-full w-full object-cover opacity-80" src={item.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-text/70 via-brand-text/20 to-transparent" />
                    <div className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      {item.rarity}
                    </div>
                  </>
                )}
                {item.locked ? (
                  <div className="absolute top-3 right-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted dark:bg-white/10 dark:text-slate-300">
                    {item.rarity}
                  </div>
                ) : null}
              </div>
              <div className="px-1 pt-3">
                <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">{item.title}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
                  {item.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
