/**
 * Starting content for a fresh account: no items yet, so totals are all zero.
 * Totals are derived from the items array (not hardcoded), so they grow once
 * real items exist. Wire these arrays to the backend later.
 */

import type { Category } from '@/components/ui/categoryIcon';
import type { IconName } from '@/components/ui/icon';
import type { StatusTone } from '@/components/ui/statusPill';

export type WarrantyStatus = {
  plan: string;
  label: string;
  tone: StatusTone;
  daysLeft: number;
  totalDays: number;
};

export type SampleItem = {
  id: string;
  name: string;
  category: Category;
  icon: IconName;
  price: string;
  addedLabel: string;
  warranty?: WarrantyStatus;
};

export type CoveredItem = SampleItem & { warranty: WarrantyStatus };

export function hasWarranty(item: SampleItem): item is CoveredItem {
  return item.warranty !== undefined;
}

/** No items yet — a brand-new account starts empty. */
export const sampleItems: SampleItem[] = [];

/** Parse a display price like "$2,399" into a number; 0 when unparseable. */
function parsePrice(price: string): number {
  const amount = Number(price.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

/** Totals derived from the items — all zero while there are none. */
export function computeTotals(items: SampleItem[]) {
  const value = items.reduce((sum, item) => sum + parsePrice(item.price), 0);
  return {
    value: `$${value.toLocaleString()}`,
    items: items.length,
    covered: items.filter(hasWarranty).length,
    expiringSoon: items.filter((item) => item.warranty?.tone === 'warning').length,
  };
}

export const sampleTotals = computeTotals(sampleItems);

export const sampleCategories: { category: Category; count: number }[] = [];

export type ActivityEntry = {
  id: string;
  title: string;
  detail: string;
  icon: IconName;
  tone: StatusTone;
};

export type ActivityGroup = { label: string; entries: ActivityEntry[] };

export const sampleActivity: ActivityGroup[] = [];
