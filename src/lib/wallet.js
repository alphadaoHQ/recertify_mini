const WALLET_STORAGE_KEY = "recertify-wallet-address";

export function getWalletProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.ethereum ?? null;
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
    throw new Error("No EVM wallet was found. Please install or open a compatible wallet.");
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const walletAddress = accounts?.[0] ?? null;

  if (!walletAddress) {
    throw new Error("Wallet connection did not return an account.");
  }

  localStorage.setItem(WALLET_STORAGE_KEY, walletAddress);
  return walletAddress;
}

export function formatWalletAddress(walletAddress) {
  if (!walletAddress) {
    return "Connect Wallet";
  }

  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
}
