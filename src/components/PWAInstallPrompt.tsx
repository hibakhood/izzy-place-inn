import { useSyncExternalStore } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { installStore } from "@/lib/pwa-install";
import { asset } from "@/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";

export function InstallAppButton() {
  const state = useSyncExternalStore(installStore.subscribe, installStore.getSnapshot, installStore.getSnapshot);
  if (state.installed) return null;
  return <button type="button" onClick={installStore.open} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-deep underline-offset-4 hover:underline"><Download className="h-4 w-4" aria-hidden="true" />Install app</button>;
}
export default function PWAInstallPrompt() {
  const state = useSyncExternalStore(installStore.subscribe, installStore.getSnapshot, installStore.getSnapshot);
  if (state.installed) return null;
  return <Dialog open={state.open} onOpenChange={open => open ? installStore.open() : installStore.close()}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border-line bg-ivory p-6 sm:p-8">
      <img src={asset("/images/brand/izzy-logo-forest-gold.png")} alt="" width="80" height="54" className="h-14 w-20 object-contain" />
      <p className="eyebrow text-gold-deep">Izzy Place Inn &amp; Suites</p>
      <DialogTitle className="font-display text-3xl font-normal leading-tight text-ink">Keep Izzy Place close</DialogTitle>
      <DialogDescription className="text-sm leading-relaxed text-muted-foreground">Add our app to your home screen for easy access to rooms, bookings and reception.</DialogDescription>
      {state.secure && state.native ? <Button onClick={() => void installStore.install()} disabled={state.busy} className="min-h-12 w-full whitespace-normal"><Download aria-hidden="true" />{state.busy ? "Opening install options…" : "Install Izzy Place"}</Button> : <div className="rounded-lg border border-line bg-mist p-4 text-sm leading-relaxed text-ink">
        {state.ios ? <><p className="flex items-center gap-2 font-semibold"><Share className="h-4 w-4 shrink-0" aria-hidden="true" />Add to your iPhone or iPad</p><p className="mt-2">Open this page in Safari. Tap Share, choose Add to Home Screen, then tap Add.</p></> : <><p className="flex items-center gap-2 font-semibold"><Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />Add from your browser</p><p className="mt-2">Open your browser menu and look for Install app or Add to Home Screen. On a computer, check for an install icon in the address bar.</p><p className="mt-2 text-muted-foreground">If your browser does not offer installation, you can bookmark this page and continue using the website.</p></>}
        {!state.secure && <p className="mt-2">Installation requires the secure HTTPS version of the website.</p>}
      </div>}
      <button type="button" onClick={installStore.close} className="min-h-11 text-sm text-muted-foreground underline-offset-4 hover:text-gold-deep hover:underline">Maybe later</button>
    </DialogContent>
  </Dialog>;
}
