/** Format an ISO date string (or Date) as e.g. "21 Nov 2026"; empty when absent/invalid. */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format integer minor units as a currency amount, e.g. (37400, "USD") -> "$374.00". */
export function formatPrice(
  cents: number | null | undefined,
  currency: string = 'USD',
): string {
  const amount = (cents ?? 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    // Unknown currency code (or no Intl): fall back to a plain formatted amount.
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Turn an enum category into a human label, e.g. "PERSONAL_CARE" -> "Personal care". */
export function formatCategory(category: string): string {
  const words = category.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Midnight-of-day timestamp, for comparing two dates by calendar day. */
function startOfDay(date: Date): number {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

/**
 * Like formatDate, but uses "Today"/"Yesterday"/"Tomorrow" when the date is within
 * a day of now; otherwise the full date (e.g. "21 Nov 2026"). Empty when invalid.
 */
export function formatRelativeDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const days = Math.round((startOfDay(date) - startOfDay(new Date())) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === -1) return 'Yesterday';
  if (days === 1) return 'Tomorrow';
  return formatDate(date);
}

/** Format an ISO date string (or Date) as a time of day, e.g. "2:30 PM"; empty when invalid. */
export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
