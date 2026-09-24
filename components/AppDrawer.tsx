import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBag } from '@/context/BagContext';
import { useDrawer } from '@/context/DrawerContext';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/utils/supabase'; // <-- 1. Import Supabase

type DrawerRoute = '/(tabs)' | '/(tabs)/controls' | '/(tabs)/activity' | '/map' | '/(tabs)/settings';

export function AppDrawer() {
  const colors = useColors();
  const { t } = useLanguage();
  const { obsConnected } = useBag();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(330, width * 0.84);
  const translateX = useRef(new Animated.Value(-panelWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -panelWidth,
      duration: 230,
      useNativeDriver: false,
    }).start();
  }, [isOpen, panelWidth, translateX]);

  const edgePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dx > 12 && gesture.x0 < 42,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 64) openDrawer();
      },
    }),
  ).current;

  const navigate = (path: DrawerRoute) => {
    closeDrawer();
    router.replace(path);
  };

  // 2. Make the function async and call Supabase
  const logout = async () => {
    closeDrawer(); // Close the drawer visually first
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
    // No router.replace('/login') needed here anymore!
    // The RootLayout listener handles the redirect perfectly.
  };

  const items: { label: string; icon: keyof typeof Feather.glyphMap; path: DrawerRoute }[] = [
    { label: t('home'), icon: 'home', path: '/(tabs)' },
    { label: t('bagControls'), icon: 'sliders', path: '/(tabs)/controls' },
    { label: t('activity'), icon: 'clock', path: '/(tabs)/activity' },
    { label: t('map'), icon: 'map', path: '/map' },
    { label: t('settings'), icon: 'settings', path: '/(tabs)/settings' },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'box-none'} {...edgePanResponder.panHandlers}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: colors.deep,
            opacity: translateX.interpolate({
              inputRange: [-panelWidth, 0],
              outputRange: [0, 0.56],
              extrapolate: 'clamp',
            }),
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} accessibilityLabel="Close menu" />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          {
            width: panelWidth,
            backgroundColor: colors.card,
            borderRightColor: colors.border,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={[styles.panelContent, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.brandRow}>
            <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
              <Ionicons name="radio" size={20} color={colors.primaryForeground} />
            </View>
            <View style={styles.brandCopy}>
              <Text style={[styles.brandTitle, { color: colors.foreground }]}>{t('streamingBag')}</Text>
              <Text style={[styles.brandUnit, { color: colors.mutedForeground }]}>{t('unit')}</Text>
            </View>
            <Pressable onPress={closeDrawer} accessibilityRole="button" accessibilityLabel="Close menu" style={({ pressed }) => [styles.closeButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}>
              <Feather name="x" size={17} color={colors.foreground} />
            </Pressable>
          </View>

          <View style={[styles.connection, { backgroundColor: colors.secondary }]}>
            <View style={[styles.connectionDot, { backgroundColor: obsConnected ? colors.success : colors.warning }]} />
            <Text style={[styles.connectionText, { color: colors.foreground }]}>{obsConnected ? t('connected') : t('offline')}</Text>
            <Text style={[styles.connectionDetail, { color: colors.mutedForeground }]}>{obsConnected ? 'OBS' : t('localMode')}</Text>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t('navigation')}</Text>
          <View style={styles.navList}>
            {items.map((item) => (
              <Pressable
                key={item.path}
                testID={`drawer-${item.icon}`}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => navigate(item.path)}
                style={({ pressed }) => [styles.navItem, pressed && { backgroundColor: colors.secondary }, pressed && styles.pressed]}
              >
                <Feather name={item.icon} size={19} color={colors.foreground} />
                <Text style={[styles.navText, { color: colors.foreground }]}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>

          <View style={styles.spacer} />
          <View style={[styles.tip, { backgroundColor: colors.accent }]}>
            <MaterialCommunityIcons name="gesture-swipe-left" size={19} color={colors.accentForeground} />
            <Text style={[styles.tipText, { color: colors.accentForeground }]}>{t('drawerHint')}</Text>
          </View>
          <Pressable testID="drawer-logout" accessibilityRole="button" accessibilityLabel={t('logout')} onPress={logout} style={({ pressed }) => [styles.logout, { borderTopColor: colors.border }, pressed && styles.pressed]}>
            <Feather name="log-out" size={18} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>{t('logout')}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  panel: { borderRightWidth: 1, bottom: 0, elevation: 10, left: 0, position: 'absolute', shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.16, shadowRadius: 18, top: 0 },
  panelContent: { flex: 1, paddingHorizontal: 18 },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandMark: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  brandCopy: { flex: 1, gap: 4 },
  brandTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  brandUnit: { fontSize: 11 },
  closeButton: { alignItems: 'center', borderRadius: 12, height: 36, justifyContent: 'center', width: 36 },
  connection: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 8, marginTop: 20, paddingHorizontal: 11, paddingVertical: 10 },
  connectionDot: { borderRadius: 5, height: 8, width: 8 },
  connectionText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  connectionDetail: { fontSize: 11, marginLeft: 'auto' },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 27, textTransform: 'uppercase' },
  navList: { gap: 4 },
  navItem: { alignItems: 'center', borderRadius: 13, flexDirection: 'row', gap: 13, paddingHorizontal: 12, paddingVertical: 13 },
  navText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  spacer: { flex: 1 },
  tip: { alignItems: 'center', borderRadius: 14, flexDirection: 'row', gap: 9, marginBottom: 12, padding: 12 },
  tipText: { flex: 1, fontSize: 11, lineHeight: 16 },
  logout: { alignItems: 'center', borderTopWidth: 1, flexDirection: 'row', gap: 12, paddingTop: 16 },
  logoutText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});