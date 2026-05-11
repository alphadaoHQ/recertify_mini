const WALLET_STORAGE_KEY = "recertify-wallet-address";

export function getWalletProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.ethereum ?? null;
}

export function hasWalletProvider() {
  return getWalletProvider() !== null;
}

export function isValidEvmAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export async function getConnectedWalletAddress() {
  const provider = getWalletProvider();
  if (!provider) {
    return localStorage.getItem(WALLET_STORAGE_KEY);
  }

  const accounts = await provider.request({ method: "eth_accounts" });
  const walletAddress = accounts?.[0] ?? null;

  if (walletAddress) {
    localStorage.setItem(WALLET_STORAGE_KEY, walletAddress);
  }

  return walletAddress;
}

export async function connectWalletAddress() {
  const provider = getWalletProvider();
  if (!provider) {
    // Signal that no provider is available — caller should show manual input
    return null;
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts?.[0] ?? null;

  if (!walletAddress) {
    throw new Error("Wallet connection did not return an account.");
  }

  localStorage.setItem(WALLET_STORAGE_KEY, walletAddress);
  return walletAddress;
}

export function connectManualWallet(address) {
  const trimmed = address?.trim().toLowerCase();
  if (!trimmed || !isValidEvmAddress(trimmed)) {
    throw new Error("Please enter a valid EVM wallet address (0x followed by 40 hex characters).");
  }

  localStorage.setItem(WALLET_STORAGE_KEY, trimmed);
  return trimmed;
}

export function formatWalletAddress(walletAddress) {
  if (!walletAddress) {
    return "Connect Wallet";
  }

  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
}

export function disconnectWallet() {
  localStorage.removeItem(WALLET_STORAGE_KEY);
}

