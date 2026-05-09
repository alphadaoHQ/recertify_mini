import { useState } from "react";
import { Icon } from "./Icon";
import { isValidEvmAddress } from "../lib/wallet";

export function WalletModal({ isOpen, onClose, onConnect }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleConnect = async () => {
    const trimmed = address.trim();

    if (!trimmed) {
      setError("Please paste your wallet address.");
      return;
    }

    if (!isValidEvmAddress(trimmed)) {
      setError("Invalid address. Must start with 0x followed by 40 hex characters.");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      await onConnect(trimmed);
      setAddress("");
      setError("");
    } catch (err) {
      setError(err.message || "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    setAddress("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative mx-4 mb-6 w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900 sm:mb-0 animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 pb-6 pt-5">
          <button
            aria-label="Close"
            className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            onClick={handleClose}
            type="button"
          >
            <Icon className="size-4" name="x" />
          </button>
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/20">
              <Icon className="size-5 text-white" name="wallet" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-white">
                Connect Wallet
              </h2>
              <p className="text-xs font-medium text-white/70">
                Paste your EVM wallet address below
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="mb-4 text-xs leading-relaxed text-brand-muted dark:text-slate-400">
            No browser wallet detected. You can manually enter your EVM wallet address
            (e.g. from MetaMask, Trust Wallet, or any EVM-compatible wallet) to link your profile.
          </p>

          <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-muted dark:text-slate-400">
            Wallet Address
          </label>
          <input
            className="w-full rounded-2xl border-2 border-brand-outline/20 bg-brand-surface-soft px-4 py-3.5 font-mono text-sm text-brand-text outline-none transition placeholder:text-brand-muted/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-primary-soft dark:focus:ring-brand-primary/20"
            onChange={(e) => {
              setAddress(e.target.value);
              setError("");
            }}
            placeholder="0x..."
            type="text"
            value={address}
          />

          {error ? (
            <p className="mt-2 text-xs font-medium text-rose-500 dark:text-rose-300">
              {error}
            </p>
          ) : null}

          <button
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-white shadow-lg shadow-brand-primary/25 transition hover:shadow-xl hover:shadow-brand-primary/35 disabled:opacity-50 disabled:shadow-none"
            disabled={isConnecting || !address.trim()}
            onClick={handleConnect}
            type="button"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>

        {/* Footer hint */}
        <div className="border-t border-brand-outline/10 px-6 py-4 dark:border-white/5">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted/60 dark:text-slate-500">
            Your address is stored locally & synced to your profile
          </p>
        </div>
      </div>
    </div>
  );
}
