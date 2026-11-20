import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/appButton';
import { Icon } from '@/components/ui/icon';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setPendingBarcode } from '@/utils/scanBridge';

export default function Scan() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  const onScanned = (data: string) => {
    if (handled.current) return; // ignore the rapid repeat scans the camera emits
    handled.current = true;
    setPendingBarcode(data);
    router.back();
  };

  // Permission still resolving.
  if (!permission) {
    return <ThemedView style={styles.root} />;
  }

  // Permission not granted yet — ask.
  if (!permission.granted) {
    return (
      <ThemedView style={styles.root}>
        <View style={[styles.permission, { paddingTop: insets.top + Spacing.xxxl }]}>
          <View style={[styles.permissionIcon, { backgroundColor: theme.primaryTint }]}>
            <Icon name="camera-outline" size={IconSize.xl} color={theme.primary} />
          </View>
          <ThemedText type="title" style={styles.textCenter}>
            Camera access
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.textCenter}>
            Allow camera access to scan a barcode and autofill the item details.
          </ThemedText>
          <View style={styles.permissionActions}>
            <AppButton label="Allow camera" icon="camera" onPress={requestPermission} />
            <AppButton label="Not now" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
        onBarcodeScanned={(result) => onScanned(result.data)}
      />

      {/* Dim frame with a clear scanning window. */}
      <View style={[styles.bar, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close scanner"
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.close}>
          <Icon name="close" size={IconSize.md} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.window} />
        <ThemedText type="small" style={styles.hint}>
          Point your camera at a barcode
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permission: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  permissionActions: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  textCenter: {
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  bar: {
    paddingHorizontal: Spacing.lg,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  window: {
    width: 260,
    height: 170,
    borderRadius: Radius.lg,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  hint: {
    color: '#FFFFFF',
  },
});
