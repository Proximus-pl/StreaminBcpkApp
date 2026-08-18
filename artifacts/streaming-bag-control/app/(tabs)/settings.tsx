import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Divider, HardwareIcon, StatusPill } from '@/components/Controls';
import { useBag } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { languageOptions, useLanguage } from '@/hooks/useLanguage';
import { useDrawer } from '@/context/DrawerContext';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { openDrawer } = useDrawer();
  const { obsConnected, connectObs, disconnectObs } = useBag();
  const themeOptions: { key: ThemeMode; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: 'system', label: 'System', icon: 'smartphone' },
    { key: 'light', label: 'Light', icon: 'sun' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
  ];
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><View><Text style={[styles.kicker, { color: colors.primary }]}>{t('preferences')}</Text><Text style={[styles.title, { color: colors.foreground }]}>{t('settings')}</Text></View><View style={styles.headerActions}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>A</Text></View><Pressable testID="settings-menu" accessibilityRole="button" accessibilityLabel="Open menu" onPress={openDrawer} style={({ pressed }) => [styles.menuButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Feather name="menu" size={18} color={colors.foreground} /></Pressable></View></View>
        <Card style={styles.profile}><View style={[styles.profileAvatar, { backgroundColor: colors.deep }]}><Text style={[styles.profileInitial, { color: colors.primary }]}>A</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>Alex Morgan</Text><Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>field operator · SB-2048</Text></View><Feather name="edit-3" size={17} color={colors.mutedForeground} /></Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('appearance')}</Text>
        <Card style={styles.themeCard}><Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>{t('appTheme')}</Text><View style={styles.themeOptions}>{themeOptions.map((option) => <Pressable key={option.key} testID={`theme-${option.key}`} accessibilityRole="button" accessibilityLabel={`Use ${option.label} theme`} onPress={() => setMode(option.key)} style={({ pressed }) => [styles.themeOption, { backgroundColor: mode === option.key ? colors.accent : colors.secondary, borderColor: mode === option.key ? colors.primary : 'transparent' }, pressed && styles.pressed]}><Feather name={option.icon} size={17} color={mode === option.key ? colors.accentForeground : colors.mutedForeground} /><Text style={[styles.themeLabel, { color: mode === option.key ? colors.accentForeground : colors.mutedForeground }]}>{t(option.key)}</Text>{mode === option.key && <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />}</Pressable>)}</View></Card>
        <Card style={styles.languageCard}><View><Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>{t('language').toUpperCase()}</Text><Text style={[styles.languageDescription, { color: colors.foreground }]}>{t('chooseLanguage')}</Text></View><View style={styles.languageOptions}>{languageOptions.map((option) => <Pressable key={option.code} testID={`language-${option.code}`} accessibilityRole="button" accessibilityLabel={`Use ${option.label}`} onPress={() => setLanguage(option.code)} style={({ pressed }) => [styles.languageOption, { backgroundColor: language === option.code ? colors.accent : colors.secondary, borderColor: language === option.code ? colors.primary : 'transparent' }, pressed && styles.pressed]}><Text style={[styles.languageLabel, { color: language === option.code ? colors.accentForeground : colors.mutedForeground }]}>{option.nativeLabel}</Text>{language === option.code && <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />}</Pressable>)}</View></Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('connections')}</Text>
        <Card style={styles.connectionCard}><View style={styles.connectionTop}><View style={[styles.connectionIcon, { backgroundColor: colors.accent }]}><HardwareIcon kind="obs" color={colors.accentForeground} /></View><View style={styles.connectionCopy}><Text style={[styles.connectionTitle, { color: colors.foreground }]}>{t('obsStudio')}</Text><Text style={[styles.connectionDetail, { color: colors.mutedForeground }]}>{obsConnected ? t('connectedLocal') : t('notConnected')}</Text></View><StatusPill label={obsConnected ? t('connected') : t('offline')} active={obsConnected} warning={!obsConnected} /></View><Divider /><Pressable testID="obs-connection" accessibilityRole="button" accessibilityLabel={obsConnected ? t('disconnectInstance') : t('connectObs')} onPress={obsConnected ? disconnectObs : connectObs} style={({ pressed }) => [styles.connectionAction, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Ionicons name={obsConnected ? 'link-outline' : 'add-circle-outline'} size={17} color={colors.foreground} /><Text style={[styles.connectionActionText, { color: colors.foreground }]}>{obsConnected ? t('disconnectInstance') : t('connectObs')}</Text><Feather name="arrow-up-right" size={16} color={colors.foreground} /></Pressable></Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('about')}</Text>
        <Card style={styles.about}><View><Text style={[styles.aboutTitle, { color: colors.foreground }]}>Streaming Bag Control</Text><Text style={[styles.aboutDetail, { color: colors.mutedForeground }]}>{t('appVersion')}</Text></View><Feather name="info" size={18} color={colors.mutedForeground} /></Card>
        <Pressable onPress={() => router.push('/login')} style={({ pressed }) => [styles.loginLink, pressed && styles.pressed]}><Text style={[styles.loginText, { color: colors.foreground }]}>{t('manageAccount')}</Text><Feather name="arrow-right" size={16} color={colors.foreground} /></Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 14, paddingHorizontal: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.8 },
  avatar: { alignItems: 'center', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  menuButton: { alignItems: 'center', borderRadius: 14, height: 40, justifyContent: 'center', width: 40 },
  profile: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  profileAvatar: { alignItems: 'center', borderRadius: 25, height: 50, justifyContent: 'center', width: 50 },
  profileInitial: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  profileCopy: { flex: 1, gap: 4 },
  profileName: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  profileEmail: { fontSize: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, marginTop: 6 },
  themeCard: { gap: 12 },
  languageCard: { gap: 12 },
  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  languageDescription: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginTop: 7 },
  themeOptions: { flexDirection: 'row', gap: 8 },
  themeOption: { alignItems: 'center', borderRadius: 13, borderWidth: 1.5, flex: 1, gap: 7, paddingVertical: 12 },
  themeLabel: { fontSize: 11, fontWeight: '700' },
  selectedDot: { borderRadius: 3, height: 5, width: 5 },
  languageOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  languageOption: { alignItems: 'center', borderRadius: 12, borderWidth: 1.5, flexBasis: '47%', flexGrow: 1, gap: 6, paddingVertical: 11 },
  languageLabel: { fontSize: 12, fontWeight: '700' },
  connectionCard: { gap: 13 },
  connectionTop: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  connectionIcon: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  connectionCopy: { flex: 1, gap: 4 },
  connectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  connectionDetail: { fontSize: 12 },
  divider: { marginVertical: 0 },
  connectionAction: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 11 },
  connectionActionText: { flex: 1, fontSize: 12, fontWeight: '700' },
  about: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  aboutTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  aboutDetail: { fontSize: 12, marginTop: 4 },
  loginLink: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  loginText: { fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});