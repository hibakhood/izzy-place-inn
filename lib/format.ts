export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}
export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
