export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
export interface InstallState { installed: boolean; secure: boolean; ios: boolean; open: boolean; busy: boolean; native: boolean }
export function shouldOfferInstall(secure: boolean, installed: boolean, dismissed: boolean) { return secure && !installed && !dismissed; }
const listeners = new Set<() => void>();
let deferred: InstallPromptEvent | null = null;
const browser = typeof window !== "undefined";
let dismissed = false;
try { dismissed = browser && sessionStorage.getItem("izzy-install-dismissed") === "1"; } catch { /* Storage is optional. */ }
const display = browser ? window.matchMedia("(display-mode: standalone)") : null;
const ios = browser && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
let state: InstallState = { installed: Boolean(display?.matches || (browser && (navigator as Navigator & { standalone?: boolean }).standalone)), secure: browser && window.isSecureContext, ios, open: false, busy: false, native: false };
state.open = shouldOfferInstall(state.secure, state.installed, dismissed);
function update(next: Partial<InstallState>) { state = { ...state, ...next }; listeners.forEach(fn => fn()); }
export const installStore = {
  subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  getSnapshot() { return state; },
  open() { if (!state.installed) update({ open: true }); },
  close() { try { sessionStorage.setItem("izzy-install-dismissed", "1"); } catch { /* Storage is optional. */ } update({ open: false }); },
  async install() {
    const event = deferred;
    if (!event || state.busy) return;
    deferred = null;
    update({ busy: true, native: false });
    try {
      await event.prompt();
      const choice = await event.userChoice;
      // Acceptance is not proof of installation; appinstalled/display-mode confirms it.
      if (choice.outcome === "accepted") installStore.close();
    } catch { /* Keep manual instructions available if the browser declines. */ }
    finally { update({ busy: false }); }
  },
};
if (browser) {
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    update({ native: true });
  });
  window.addEventListener("appinstalled", () => { deferred = null; update({ installed: true, open: false, native: false }); });
  display?.addEventListener("change", event => { if (event.matches) update({ installed: true, open: false }); });
}
