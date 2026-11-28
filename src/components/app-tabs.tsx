import { Colors } from '@/constants/theme';
import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  // The selected tab turns brand green; unselected icons sit in muted text colour.
  // Colours are resolved from the current scheme (not DynamicColorIOS, which is
  // iOS-only and crashes on Android); useColorScheme re-renders on theme change.
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      labelStyle={{ fontSize: 10, fontWeight: '500' }}
      // Without this, Android tints the bar with its default Material surface
      // (the purple-ish cast); pin it to the themed card colour instead.
      backgroundColor={colors.card}
      // Android's selected-tab pill defaults to a Material lavender; tint it to
      // the brand green instead. (Android-only; iOS has no indicator pill.)
      indicatorColor={colors.primaryTint}
      tintColor={colors.primary}
      iconColor={colors.textSecondary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house.circle', selected: 'house.circle.fill' }}
          md="home"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="inventory">
        <NativeTabs.Trigger.Label>Inventory</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'cube', selected: 'cube.fill' }}
          md="inventory_2"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="activity">
        <NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bell', selected: 'bell.fill' }}
          md="notifications"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
