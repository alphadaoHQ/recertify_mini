import { Icon } from "./Icon";

export function TopBar({
  appName,
  isDark,
  isTelegramReady,
  isWalletConnected,
  isWalletConnecting,
  onConnectWallet,
  onToggleTheme,
  user,
  walletLabel,
}) {
  return (
    <header className="sticky top-0 z-20 mx-auto flex w-full max-w-[460px] items-center justify-between px-5 pt-5 pb-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-brand-primary/15">
          <img alt={user.name} className="h-full w-full object-cover" src={user.avatar} />
        </div>
        <div>
          <p className="font-display text-base font-extrabold tracking-[-0.02em] text-brand-primary dark:text-brand-primary-soft">
            {appName}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-secondary dark:text-emerald-300">
              <Icon className="size-3.5" name="check" />
              {isTelegramReady ? "Telegram Ready" : "Browser Preview"}
            </p>
            <button
              className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                isWalletConnected
                  ? "bg-emerald-100 text-brand-secondary dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-brand-primary-soft/70 text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft"
              }`}
              disabled={isWalletConnecting}
              onClick={onConnectWallet}
              type="button"
            >
              {isWalletConnecting ? "Connecting..." : walletLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand-primary-soft/70 text-brand-primary transition hover:bg-brand-primary-soft dark:bg-white/10 dark:text-brand-primary-soft dark:hover:bg-white/15"
          onClick={onToggleTheme}
          type="button"
        >
          <Icon className="size-5" name={isDark ? "sun" : "moon"} />
        </button>
      </div>
    </header>
  );
}
