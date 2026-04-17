const STORAGE_KEY = "recertify-local-state-v1";

function readStore() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getWalletState(walletAddress) {
  const store = readStore();
  return store[walletAddress] ?? null;
}

export function setWalletState(walletAddress, walletState) {
  const store = readStore();
  store[walletAddress] = walletState;
  writeStore(store);
}
