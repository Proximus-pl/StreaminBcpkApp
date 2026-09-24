import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Eyebrow, IconSquare, StatusPill } from '@/components/Controls';
import { useBag, type ActivityItem } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';
import { useLanguage, type TranslationKey } from '@/hooks/useLanguage';
import { useDrawer } from '@/context/DrawerContext';

function ActivityIcon({ kind, color }: { kind: ActivityItem['kind']; color: string }) {
  if (kind === 'recording') return <Ionicons name="radio-outline" size={19} color={color} />;
  if (kind === 'camera') return <Ionicons name="videocam-outline" size={19} color={color} />;
  if (kind === 'actuator') return <MaterialCommunityIcons name="arrow-expand-vertical" size={19} color={color} />;
  if (kind === 'voice') return <Ionicons name="mic-outline" size={19} color={color} />;
  return <Feather name="activity" size={19} color={color} />;
}

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}

function getViewLabel(view: 'Wide' | 'Front' | 'Rear', t: (key: TranslationKey) => string) {
  if (view === 'Wide') return t('wideCamera');
  if (view === 'Front') return t('frontCamera');
  return t('rearCamera');
}

function getActivityCopy(item: ActivityItem, t: (key: TranslationKey) => string) {
  switch (item.event.type) {
    case 'bagPoweredOn':
      return { title: t('activityBagPoweredOn'), detail: t('activityAllSystemsNominal') };
    case 'cameraViewSet':
      return {
        title: fill(t('activityCameraViewSet'), { view: getViewLabel(item.event.view, t) }),
        detail: t('activityCameraQuality'),
      };
    case 'actuatorMoved':
      return {
        title: t(item.event.direction === 'extended' ? 'activityActuatorExtended' : 'activityActuatorRetracted'),
        detail: fill(t('activityPosition'), { value: item.event.position }),
      };
    case 'recordingEnded':
      return { title: t('activityRecordingEnded'), detail: t('activityRecordingEndedDetail') };
    case 'recordingStarted':
      return { title: t('activityRecordingStarted'), detail: t('activityObsReceiving') };
    case 'recordingStopped':
      return {
        title: t('activityRecordingStopped'),
        detail: fill(t('activitySecondsCaptured'), { value: item.event.seconds }),
      };
    case 'cameraToggled':
      return {
        title: t(item.event.enabled ? 'activityCameraEnabled' : 'activityCameraDisabled'),
        detail: fill(t('activityView'), { view: getViewLabel(item.event.view, t) }),
      };
    case 'visibilityLedToggled':
      return {
        title: t(item.event.enabled ? 'activityVisibilityLedOn' : 'activityVisibilityLedOff'),
        detail: t(item.event.enabled ? 'activityDarknessArmed' : 'activityManualControl'),
      };
    case 'voiceCommandCompleted':
      return { title: t('activityVoiceCompleted'), detail: t('activityStartRecording') };
    case 'obsConnected':
      return { title: t('activityObsConnected'), detail: t('activityReadyToStream') };
    case 'obsDisconnected':
      return { title: t('activityObsDisconnected'), detail: t('activityLocalControls') };
  }
}

function localizeActivityTime(time: string, t: (key: TranslationKey) => string) {
  if (time === 'Now') return t('now');
  if (time.startsWith('Today, ')) return `${t('today')}, ${time.slice('Today, '.length)}`;
  if (time.startsWith('Yesterday, ')) return `${t('yesterday')}, ${time.slice('Yesterday, '.length)}`;
  return time;
}

export default function ActivityScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const { activity, isRecording, recordingSeconds } = useBag();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={activity}
        keyExtractor={(item) => item.id}
        scrollEnabled={activity.length > 0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: 110 }]}
        ListHeaderComponent={<><View style={styles.header}><View><Text style={[styles.kicker, { color: colors.primary }]}>{t('timeline')}</Text><Text style={[styles.title, { color: colors.foreground }]}>{t('activity')}</Text></View><View style={styles.headerActions}><StatusPill label={isRecording ? `${recordingSeconds}s ${t('live')}` : t('idle')} active={isRecording} /><IconSquare icon="menu" onPress={openDrawer} accessibilityLabel="Open menu" /></View></View><Card style={styles.summary}><View><Eyebrow>{t('sessionStatus')}</Eyebrow><Text style={[styles.summaryTitle, { color: colors.foreground }]}>{isRecording ? t('capturingStream') : t('readyNextTake')}</Text><Text style={[styles.summaryDetail, { color: colors.mutedForeground }]}>{t('everyControl')}</Text></View><View style={[styles.summaryMark, { backgroundColor: isRecording ? colors.destructive : colors.primary }]}><Feather name={isRecording ? 'radio' : 'check'} size={20} color={isRecording ? colors.destructiveForeground : colors.primaryForeground} /></View></Card><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('recentActivity')}</Text></>}
        ListEmptyComponent={<Card><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t('noActivity')}</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('noActivityBody')}</Text></Card>}
         renderItem={({ item }) => {
           const copy = getActivityCopy(item, t);
           return <View style={styles.item}><View style={[styles.itemIcon, { backgroundColor: colors.secondary }]}><ActivityIcon kind={item.kind} color={colors.foreground} /></View><View style={styles.itemCopy}><Text style={[styles.itemTitle, { color: colors.foreground }]}>{copy.title}</Text><Text style={[styles.itemDetail, { color: colors.mutedForeground }]}>{copy.detail}</Text></View><Text style={[styles.itemTime, { color: colors.mutedForeground }]}>{localizeActivityTime(item.time, t)}</Text></View>;
         }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 16, paddingHorizontal: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.8 },
  summary: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 108 },
  summaryTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, marginTop: 7 },
  summaryDetail: { fontSize: 12, marginTop: 5 },
  summaryMark: { alignItems: 'center', borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, marginTop: 2 },
  item: { alignItems: 'center', flexDirection: 'row', gap: 12, minHeight: 68 },
  itemIcon: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  itemCopy: { flex: 1, gap: 5 },
  itemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  itemDetail: { fontSize: 12 },
  itemTime: { fontSize: 11, maxWidth: 82, textAlign: 'right' },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  emptyText: { fontSize: 12, marginTop: 6 },
});