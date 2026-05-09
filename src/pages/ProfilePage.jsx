import { useState } from "react";
import { Icon } from "../components/Icon";
import { ProgressRing } from "../components/ProgressRing";

export function ProfilePage({ isWalletConnected, nfts, onSetUsername, progress, tasks, user, walletAddress, whitelistStatus }) {
  const progressPercent = user.xp + user.xpToNextRank > 0 ? Math.round((user.xp / (user.xp + user.xpToNextRank)) * 100) : 0;
  const claimedTasks = tasks.filter((task) => task.claimed).length;

  const [usernameInput, setUsernameInput] = useState("");
  const [isSettingUsername, setIsSettingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const hasUsername = Boolean(user.username);

  const handleSetUsername = async () => {
    if (!usernameInput.trim()) {
      setUsernameError("Please enter a username.");
      return;
    }

    setIsSettingUsername(true);
    setUsernameError("");
    const success = await onSetUsername(usernameInput.trim());
    setIsSettingUsername(false);

    if (!success) {
      setUsernameError("Username may already be taken. Try a different one.");
    } else {
      setUsernameInput("");
    }
  };

  return (
    <div className="grid gap-6 pb-4">
      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4 max-[420px]:flex-col max-[420px]:items-start">
          <div>
            <h1 className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.05em] text-brand-text dark:text-white">
              {user.name}
            </h1>
            {hasUsername ? (
              <p className="mt-1 text-sm font-bold text-brand-primary dark:text-brand-primary-soft">
                @{user.username}
              </p>
            ) : null}
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

        {/* Username Section */}
        {isWalletConnected && !hasUsername ? (
          <div className="rounded-[1.7rem] border-2 border-dashed border-brand-primary/25 bg-brand-primary/4 p-5 dark:border-brand-primary/30 dark:bg-brand-primary/8">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="size-5 text-brand-primary dark:text-brand-primary-soft" name="edit" />
              <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">Set Your Username</h3>
            </div>
            <p className="text-xs text-brand-muted dark:text-slate-300 mb-3">
              Choose a unique username for your profile. This cannot be changed once set.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-muted dark:text-slate-400">@</span>
                <input
                  className="w-full rounded-full bg-white py-3 pl-8 pr-4 text-sm font-medium text-brand-text shadow-float outline-none ring-2 ring-transparent transition focus:ring-brand-primary dark:bg-white/8 dark:text-white dark:focus:ring-brand-primary-soft"
                  disabled={isSettingUsername}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setUsernameError("");
                  }}
                  placeholder="your_username"
                  type="text"
                  value={usernameInput}
                />
              </div>
              <button
                className="rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand-primary/20 disabled:opacity-60"
                disabled={isSettingUsername || !usernameInput.trim()}
                onClick={handleSetUsername}
                type="button"
              >
                {isSettingUsername ? "Saving..." : "Set"}
              </button>
            </div>
            {usernameError ? (
              <p className="mt-2 text-xs font-medium text-rose-500 dark:text-rose-300">{usernameError}</p>
            ) : null}
          </div>
        ) : null}

        {/* Wallet Info */}
        {isWalletConnected ? (
          <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-float dark:bg-white/5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">
              Wallet Address
            </p>
            <p className="mt-1 font-mono text-xs font-medium text-brand-text dark:text-slate-200 break-all">
              {walletAddress}
            </p>
            {hasUsername ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-300">Username:</span>
                <span className="rounded-full bg-brand-primary-soft/60 px-2.5 py-1 text-[11px] font-extrabold text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                  @{user.username}
                </span>
                <Icon className="size-3.5 text-emerald-500" name="check" />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Whitelist Status Card */}
        {isWalletConnected && whitelistStatus ? (
          <div className={`rounded-[1.7rem] p-5 shadow-float ${
            whitelistStatus.eligible
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100/80 dark:from-emerald-500/10 dark:to-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20"
              : "bg-white/75 dark:bg-white/5 border border-brand-outline/10 dark:border-white/10"
          }`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Icon className={`size-5 ${whitelistStatus.eligible ? "text-emerald-600 dark:text-emerald-300" : "text-brand-muted dark:text-slate-400"}`} name={whitelistStatus.eligible ? "check" : "lock"} />
                <h3 className="font-display text-sm font-extrabold text-brand-text dark:text-white">
                  Whitelist Status
                </h3>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                whitelistStatus.eligible
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              }`}>
                {whitelistStatus.eligible ? "Eligible ✓" : "Not Yet Eligible"}
              </span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-brand-muted dark:text-slate-300">
                  <Icon className={`size-3.5 ${whitelistStatus.tasksCompleted >= whitelistStatus.tasksRequired ? "text-emerald-500" : "text-brand-muted dark:text-slate-400"}`} name="check" />
                  Tasks completed
                </span>
                <span className="font-bold text-brand-text dark:text-white">
                  {whitelistStatus.tasksCompleted}/{whitelistStatus.tasksRequired}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-brand-muted dark:text-slate-300">
                  <Icon className={`size-3.5 ${whitelistStatus.modulesCompleted >= whitelistStatus.modulesRequired ? "text-emerald-500" : "text-brand-muted dark:text-slate-400"}`} name="check" />
                  Modules completed
                </span>
                <span className="font-bold text-brand-text dark:text-white">
                  {whitelistStatus.modulesCompleted}/{whitelistStatus.modulesRequired}
                </span>
              </div>
            </div>
            {whitelistStatus.eligible && whitelistStatus.rank ? (
              <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                Whitelist Rank: #{whitelistStatus.rank}
              </div>
            ) : null}
          </div>
        ) : null}

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
