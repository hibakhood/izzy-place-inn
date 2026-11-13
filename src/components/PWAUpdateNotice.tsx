import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function PWAUpdateNotice() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const alreadyControlled = Boolean(navigator.serviceWorker.controller);
    const changed = () => { if (alreadyControlled) setAvailable(true); };
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', changed);
  }, []);
  if (!available) return null;
  return <div role="status" className="fixed inset-x-3 bottom-4 z-50 mx-auto flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-ivory p-4 text-sm text-ink shadow-lg print:hidden">
    <p>A website update is ready. Refresh when you have finished this booking.</p>
    <Button size="sm" onClick={() => window.location.reload()}>Refresh app</Button>
  </div>;
}
