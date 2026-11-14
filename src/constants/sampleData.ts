/**
 * Hardcoded sample content for the UI. The app does not call the backend yet;
 * every screen reads from here so the data story stays consistent across screens.
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

export const sampleUser = {
  name: 'Gideon Atauba',
  email: 'gideon@storr.app',
} as const;

export const sampleTotals = {
  value: '$18,420',
  items: 124,
  covered: 98,
  expiringSoon: 3,
} as const;

export const sampleItems: SampleItem[] = [
  {
    id: 'macbook',
    name: 'MacBook Pro 14"',
    category: 'Electronics',
    icon: 'laptop-outline',
    price: '$2,399',
    addedLabel: 'Added 2 hours ago',
    warranty: { plan: 'AppleCare+', label: 'Covered', tone: 'success', daysLeft: 214, totalDays: 365 },
  },
  {
    id: 'sony-xm6',
    name: 'Sony WH-1000XM6',
    category: 'Electronics',
    icon: 'headset-outline',
    price: '$399',
    addedLabel: 'Added yesterday',
    warranty: { plan: 'Manufacturer warranty', label: '7 days left', tone: 'warning', daysLeft: 7, totalDays: 365 },
  },
  {
    id: 'dyson',
    name: 'Dyson V15',
    category: 'Home',
    icon: 'flash-outline',
    price: '$649',
    addedLabel: 'Added 3 days ago',
    warranty: { plan: 'Manufacturer warranty', label: 'Covered', tone: 'success', daysLeft: 340, totalDays: 730 },
  },
  {
    id: 'bravia',
    name: 'Sony Bravia TV',
    category: 'Home',
    icon: 'tv-outline',
    price: '$1,199',
    addedLabel: 'Added 2 weeks ago',
    warranty: { plan: 'Extended plan', label: '24 days left', tone: 'warning', daysLeft: 24, totalDays: 730 },
  },
  {
    id: 'desk',
    name: 'Standing desk',
    category: 'Work',
    icon: 'desktop-outline',
    price: '$410',
    addedLabel: 'Added last week',
    warranty: { plan: 'Manufacturer warranty', label: 'Expired', tone: 'danger', daysLeft: 0, totalDays: 365 },
  },
  {
    id: 'canon',
    name: 'Canon EOS R6',
    category: 'Electronics',
    icon: 'camera-outline',
    price: '$2,499',
    addedLabel: 'Added 3 days ago',
  },
];

export const sampleCategories: { category: Category; count: number }[] = [
  { category: 'Electronics', count: 42 },
  { category: 'Home', count: 31 },
  { category: 'Work', count: 18 },
  { category: 'Other', count: 33 },
];

export type ActivityEntry = {
  id: string;
  title: string;
  detail: string;
  icon: IconName;
  tone: StatusTone;
};

export type ActivityGroup = { label: string; entries: ActivityEntry[] };

export const sampleActivity: ActivityGroup[] = [
  {
    label: 'Today',
    entries: [
      { id: 'a1', title: 'Added MacBook Pro 14"', detail: '2 hours ago', icon: 'add-circle-outline', tone: 'success' },
      { id: 'a2', title: 'Reminder scheduled', detail: '5 hours ago · Sony WH-1000XM6', icon: 'alarm-outline', tone: 'warning' },
    ],
  },
  {
    label: 'Yesterday',
    entries: [
      { id: 'a3', title: 'Receipt added', detail: 'Canon EOS R6', icon: 'receipt-outline', tone: 'neutral' },
      { id: 'a4', title: 'Item updated', detail: 'Standing desk · location changed', icon: 'create-outline', tone: 'neutral' },
    ],
  },
  {
    label: '3 days ago',
    entries: [
      { id: 'a5', title: 'Dyson V15 marked as covered', detail: 'Manufacturer warranty linked', icon: 'shield-checkmark-outline', tone: 'success' },
    ],
  },
];
