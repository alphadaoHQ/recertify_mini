import WebApp from "@twa-dev/sdk";

export function initializeTelegramApp() {
  if (!WebApp?.initDataUnsafe) {
    return false;
  }

  try {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor("#fff7fe");
    return true;
  } catch {
    return false;
  }
}

export function getTelegramContext() {
  return WebApp?.initDataUnsafe || null;
}
