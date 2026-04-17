export function RanksPage({ isWalletConnected, leaderboard, user }) {
  const champions = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const accentClass = {
    bronze: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    default: "bg-brand-primary-soft/75 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft",
    gold: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    silver: "bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
  };

  return (
    <div className="grid gap-6 pb-4">
      <section className="rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-primary-bright p-7 text-white shadow-ambient">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">Weekly Ranking</p>
        <h1 className="mt-2 max-w-[13ch] font-display text-[2.25rem] leading-[0.98] font-extrabold tracking-[-0.04em]">
          Exclusive NFT artifacts
        </h1>
        <p className="mt-3 max-w-[29ch] text-sm leading-6 text-white/90">
          Leaderboard placement updates from wallet-linked profile XP earned through modules and tasks.
        </p>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Weekly Champions</h2>
          <span className="rounded-full bg-brand-primary-soft/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
            Your Rank: {user.rank ?? "Unranked"}
          </span>
        </div>
        <div className="grid grid-cols-3 items-end gap-3 max-[420px]:grid-cols-1">
          {champions.map((entry, index) => (
            <article
              className={`rounded-[1.8rem] p-4 text-center shadow-float ${
                index === 0
                  ? "bg-gradient-to-br from-brand-primary to-brand-primary-bright text-white"
                  : "bg-white/75 text-brand-text backdrop-blur-xl dark:bg-white/5 dark:text-white"
              } ${index === 0 ? "min-h-48" : "min-h-40"}`}
              key={entry.id}
            >
              <img
                alt={entry.name}
                className={`mx-auto h-16 w-16 rounded-[1.25rem] object-cover ring-4 ${
                  index === 0 ? "ring-white/25" : "ring-white/60 dark:ring-white/10"
                }`}
                src={entry.avatar}
              />
              <div
                className={`mx-auto mt-4 inline-flex min-w-9 items-center justify-center rounded-full px-3 py-2 text-xs font-black ${
                  index === 0 ? "bg-white/20 text-white" : accentClass[entry.accent]
                }`}
              >
                {entry.badge}
              </div>
              <h3 className="mt-3 font-display text-sm font-extrabold">{entry.name}</h3>
              <p className={`mt-1 text-xs ${index === 0 ? "text-white/85" : "text-brand-muted dark:text-slate-300"}`}>
                {entry.xp.toLocaleString()} XP
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">Global Standing</h2>
          <span className="rounded-full bg-brand-primary-soft/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
            {isWalletConnected ? "Live Wallet Rank" : "Connect Wallet"}
          </span>
        </div>
        <div className="grid gap-3">
          {rest.map((entry) => (
            <article
              className="flex items-center justify-between gap-4 rounded-[1.7rem] bg-white/75 p-4 shadow-float backdrop-blur-xl dark:bg-white/5"
              key={entry.id}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-brand-primary-soft/75 px-3 py-2 text-sm font-black text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                  {entry.rank}
                </div>
                <img alt={entry.name} className="size-12 rounded-2xl object-cover" src={entry.avatar} />
                <div>
                  <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">{entry.name}</h3>
                  <p className="mt-1 text-xs text-brand-muted dark:text-slate-300">Lvl {entry.level} learner</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-extrabold text-brand-text dark:text-white">
                  {entry.xp.toLocaleString()} XP
                </p>
              </div>
            </article>
          ))}
          {isWalletConnected ? (
            <article className="flex items-center justify-between gap-4 rounded-[1.7rem] border border-dashed border-brand-primary/20 bg-brand-primary/6 p-4 shadow-float dark:border-brand-primary/25 dark:bg-brand-primary/10">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-brand-primary-soft/75 px-3 py-2 text-sm font-black text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                  {user.rank ?? "-"}
                </div>
                <img alt={user.name} className="size-12 rounded-2xl object-cover" src={user.avatar} />
                <div>
                  <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">You</h3>
                  <p className="mt-1 text-xs text-brand-primary/70 dark:text-brand-primary-soft/80">
                    Wallet-linked leaderboard profile
                  </p>
                </div>
              </div>
              <div className="text-right font-display text-sm font-extrabold text-brand-primary dark:text-brand-primary-soft">
                {user.xp.toLocaleString()} XP
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  );
}
