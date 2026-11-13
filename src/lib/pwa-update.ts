// Recheck installed-app updates when the user returns, including iOS standalone.
// Updating never uploads form data or automatically reloads a guest's booking.
if (import.meta.env.PROD && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    let lastCheck = 0;
    const check = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastCheck < 60000) return;
      lastCheck = Date.now();
      void registration.update().catch(() => { /* Offline guests can keep browsing. */ });
    };
    window.addEventListener('pageshow', check);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    check();
  }).catch(() => { /* Installation is optional. */ });
}
