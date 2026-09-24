import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Eyebrow, IconSquare, StatusPill } from '@/components/Controls';
import { useDrawer } from '@/context/DrawerContext';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/hooks/useLanguage';

export default function MapScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 34 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>FIELD MAP / 05</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>{t('map')}</Text>
          </View>
          <IconSquare icon="menu" onPress={openDrawer} accessibilityLabel="Open menu" />
        </View>
        <Card style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="navigate" size={20} color={colors.accentForeground} />
          </View>
          <View style={styles.statusCopy}>
            <Eyebrow>{t('fieldUnitLocation')}</Eyebrow>
            <Text style={[styles.location, { color: colors.foreground }]}>Warehouse District</Text>
            <Text style={[styles.locationDetail, { color: colors.mutedForeground }]}>{t('gpsSynced')}</Text>
          </View>
          <StatusPill label="GPS" active />
        </Card>
        <View style={[styles.map, { backgroundColor: colors.deep, borderColor: colors.border }]}>
          <View style={[styles.mapGrid, { borderColor: colors.overlay }]} />
          <View style={[styles.road, styles.roadOne, { backgroundColor: colors.overlay }]} />
          <View style={[styles.road, styles.roadTwo, { backgroundColor: colors.overlay }]} />
          <View style={[styles.road, styles.roadThree, { backgroundColor: colors.overlay }]} />
          <View style={[styles.route, { backgroundColor: colors.primary }]} />
          <View style={[styles.pin, { backgroundColor: colors.primary, borderColor: colors.deep }]}>
            <Ionicons name="radio" size={19} color={colors.primaryForeground} />
          </View>
          <View style={[styles.mapLabel, { backgroundColor: colors.card }]}>
            <Text style={[styles.mapLabelTitle, { color: colors.foreground }]}>SB-2048</Text>
            <Text style={[styles.mapLabelDetail, { color: colors.mutedForeground }]}>47.4979° N · 19.0402° E</Text>
          </View>
          <View style={styles.zoom}><Pressable onPress={() => undefined} style={[styles.zoomButton, { backgroundColor: colors.card }]}><Feather name="plus" size={17} color={colors.foreground} /></Pressable><Pressable onPress={() => undefined} style={[styles.zoomButton, { backgroundColor: colors.card }]}><Feather name="minus" size={17} color={colors.foreground} /></Pressable></View>
        </View>
        <Text style={[styles.helper, { color: colors.mutedForeground }]}>{t('mapMockDescription')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 16, paddingHorizontal: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.8 },
  statusCard: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  statusIcon: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  statusCopy: { flex: 1, gap: 4 },
  location: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  locationDetail: { fontSize: 12 },
  map: { borderRadius: 24, borderWidth: 1, height: 430, overflow: 'hidden', position: 'relative' },
  mapGrid: { borderWidth: 1, height: 600, left: 25, opacity: 0.26, position: 'absolute', top: -80, transform: [{ rotate: '24deg' }], width: 500 },
  road: { borderRadius: 4, position: 'absolute' },
  roadOne: { height: 15, left: -40, opacity: 0.3, top: 155, transform: [{ rotate: '-22deg' }], width: 500 },
  roadTwo: { height: 11, opacity: 0.25, right: -90, top: 286, transform: [{ rotate: '38deg' }], width: 520 },
  roadThree: { height: 9, left: -30, opacity: 0.2, top: 350, transform: [{ rotate: '8deg' }], width: 400 },
  route: { borderRadius: 7, height: 4, left: 94, opacity: 0.9, position: 'absolute', top: 221, transform: [{ rotate: '-28deg' }], width: 160 },
  pin: { alignItems: 'center', borderRadius: 25, borderWidth: 4, height: 50, justifyContent: 'center', left: 145, position: 'absolute', top: 190, width: 50 },
  mapLabel: { borderRadius: 12, left: 205, paddingHorizontal: 11, paddingVertical: 9, position: 'absolute', top: 185 },
  mapLabelTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  mapLabelDetail: { fontSize: 9, marginTop: 3 },
  zoom: { bottom: 16, gap: 7, position: 'absolute', right: 16 },
  zoomButton: { alignItems: 'center', borderRadius: 11, height: 36, justifyContent: 'center', width: 36 },
  helper: { fontSize: 12, lineHeight: 18, paddingHorizontal: 4 },
});