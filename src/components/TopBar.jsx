import { Icon } from "./Icon";

export function TopBar({
  appName,
  isDark,
  isTelegramReady,
  isWalletConnected,
  isWalletConnecting,
  onConnectWallet,
  onDisconnectWallet,
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

            {/* Username display */}
            {user.username ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-soft/60 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
                @{user.username}
              </span>
            ) : null}
          </div>

          {/* Wallet connect / disconnect */}
          <div className="mt-1.5 flex items-center gap-2">
            {isWalletConnected ? (
              <>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary dark:bg-emerald-500/15 dark:text-emerald-300">
                  {walletLabel}
                </span>
                <button
                  className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-rose-600 transition hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25"
                  onClick={onDisconnectWallet}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="rounded-full bg-brand-primary-soft/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-primary transition hover:bg-brand-primary-soft dark:bg-white/10 dark:text-brand-primary-soft dark:hover:bg-white/15"
                disabled={isWalletConnecting}
                onClick={onConnectWallet}
                type="button"
              >
                {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
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
