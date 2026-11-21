import * as Notifications from 'expo-notifications';

import { formatDate } from '@/utils/format';
import type { Item } from '@/utils/types';

const DAY_MS = 86_400_000;

// Show a banner for reminders that fire while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const reminderIdFor = (itemId: string) => `reminder-${itemId}`;

/** Ask for notification permission (no-op if already granted). Returns whether it's allowed. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync().catch(() => null);
  if (current?.granted) return true;
  const requested = await Notifications.requestPermissionsAsync().catch(() => null);
  return requested?.granted ?? false;
}

/** Cancel the reminder for an item, if one is scheduled. */
export async function cancelItemReminder(itemId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(reminderIdFor(itemId)).catch(() => {});
}

/**
 * Schedule (or replace) a local reminder for an item, `remindDaysBefore` days before its
 * warranty or expiry date. Silently does nothing without a date, without permission, or
 * when that moment is already in the past.
 */
export async function scheduleItemReminder(item: Item): Promise<void> {
  await cancelItemReminder(item.id);

  const lapseIso = item.warrantyExpiresAt ?? item.expiryDate;
  if (!lapseIso) return;
  const lapse = new Date(lapseIso).getTime();
  if (Number.isNaN(lapse)) return;

  const fireAt = new Date(lapse - (item.remindDaysBefore ?? 7) * DAY_MS);
  if (fireAt.getTime() <= Date.now()) return;

  const granted = await ensureNotificationPermission();
  if (!granted) return;

  const verb = item.warrantyExpiresAt ? 'warranty ends' : 'expires';
  await Notifications.scheduleNotificationAsync({
    identifier: reminderIdFor(item.id),
    content: {
      title: `Heads up — ${item.name}`,
      body: `${item.name} ${verb} ${formatDate(lapseIso)}.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireAt },
  }).catch(() => {});
}

/** Re-sync reminders for a whole list (e.g. after sign-in). Best-effort. */
export async function syncItemReminders(items: Item[]): Promise<void> {
  await Promise.all(items.map((item) => scheduleItemReminder(item)));
}
