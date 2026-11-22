import { Colors } from '@/constants/theme';
import { NativeTabs } from 'expo-router/native-tabs';
import { DynamicColorIOS, useColorScheme } from 'react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  // The selected tab turns brand green; unselected icons sit in muted text colour.
  const activeTint = DynamicColorIOS({
    light: Colors.light.primary,
    dark: Colors.dark.primary,
  });

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      labelStyle={{ fontSize: 10, fontWeight: '500' }}
      tintColor={activeTint}
      iconColor={DynamicColorIOS({ light: colors.textSecondary, dark: colors.textSecondary })}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house.circle', selected: 'house.circle.fill' }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="inventory">
        <NativeTabs.Trigger.Label>Inventory</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'cube', selected: 'cube.fill' }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="activity">
        <NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bell', selected: 'bell.fill' }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
