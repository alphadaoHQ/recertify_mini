import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

function MessageBanner({ tone = "success", message }) {
  if (!message) {
    return null;
  }

  const toneClass =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <div className={`rounded-[1.35rem] border px-4 py-3 text-sm font-medium shadow-float ${toneClass}`}>
      {message}
    </div>
  );
}

export function AppShell({
  activeTab,
  appName,
  children,
  errorMessage,
  isDark,
  isTelegramReady,
  isWalletConnected,
  isWalletConnecting,
  onConnectWallet,
  onDisconnectWallet,
  onTabChange,
  onToggleTheme,
  statusMessage,
  user,
  walletLabel,
}) {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text transition-colors dark:bg-slate-950 dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-64px] right-[-52px] size-52 rounded-full bg-brand-primary/20 blur-3xl dark:bg-brand-primary/25" />
        <div className="absolute bottom-20 left-[-40px] size-44 rounded-full bg-brand-secondary/10 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative">
        <TopBar
          appName={appName}
          isDark={isDark}
          isTelegramReady={isTelegramReady}
          isWalletConnected={isWalletConnected}
          isWalletConnecting={isWalletConnecting}
          onConnectWallet={onConnectWallet}
          onDisconnectWallet={onDisconnectWallet}
          onToggleTheme={onToggleTheme}
          user={user}
          walletLabel={walletLabel}
        />
        <main className="mx-auto grid w-full max-w-[460px] gap-4 px-5 pb-32">
          <MessageBanner message={statusMessage} tone="success" />
          <MessageBanner message={errorMessage} tone="error" />
          {children}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}

