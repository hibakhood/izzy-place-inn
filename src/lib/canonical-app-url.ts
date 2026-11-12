// Old installed PWAs may still open the apex domain from a cached app shell.
// Navigate before collecting guest data so API POSTs never cross its www redirect.
export function canonicalAppUrl(href: string): string | null {
  const url = new URL(href);
  if (url.protocol !== 'https:' || url.hostname !== 'izzyplaceinn.com' || url.port) return null;
  url.hostname = 'www.izzyplaceinn.com';
  return url.href;
}
