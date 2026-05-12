const WALLET_STORAGE_KEY = "recertify-wallet-address";

export function formatWalletAddress(walletAddress) {
  if (!walletAddress) {
    return "Connect Wallet";
  }

  // TON addresses are longer, show first 4 + last 4 after prefix
  if (walletAddress.length > 12) {
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }

  return walletAddress;
}

export function disconnectWallet() {
  localStorage.removeItem(WALLET_STORAGE_KEY);
}
