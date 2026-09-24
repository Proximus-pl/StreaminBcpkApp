import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, HardwareIcon, IconSquare, StatusPill } from '@/components/Controls';
import { useBag } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/hooks/useLanguage';
import { useDrawer } from '@/context/DrawerContext';

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default function HomeScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const {
    isRecording,
    recordingSeconds,
    cameraOn,
    cameraView,
    actuatorPosition,
    ledOn,
    obsConnected,
    toggleRecording,
    startListening,
  } = useBag();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: 112 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topbar}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>
              {t('fieldControl')}
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {t('home')}
            </Text>
          </View>
          <IconSquare icon="menu" onPress={openDrawer} accessibilityLabel="Open menu" />
        </View>

        <LinearGradient
          colors={[colors.deep, colors.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroHeader}>
            <View>
              <Text style={[styles.heroLabel, { color: colors.primary }]}>
                {t('streamingBag')}
              </Text>
              <Text style={[styles.heroName, { color: colors.deepForeground }]}>
                {t('unit')}
              </Text>
            </View>
            <StatusPill
              label={obsConnected ? t('obsLinked') : t('localMode')}
              active={obsConnected}
              warning={!obsConnected}
            />
          </View>
          <View style={styles.timerRow}>
            <View>
              <Text style={[styles.timer, { color: colors.deepForeground }]}>
                {isRecording ? formatDuration(recordingSeconds) : '00:00'}
              </Text>
              <Text style={[styles.timerCaption, { color: colors.mutedForeground }]}>
                {isRecording ? t('recordingLive') : t('readyToRecord')}
              </Text>
            </View>
            <Pressable
              testID="toggle-recording"
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
              onPress={toggleRecording}
              style={({ pressed }) => [
                styles.recordButton,
                { backgroundColor: isRecording ? colors.destructive : colors.primary },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.recordInner,
                  {
                    borderColor: isRecording
                      ? colors.destructiveForeground
                      : colors.primaryForeground,
                  },
                ]}
              >
                <Ionicons
                  name={isRecording ? 'stop' : 'radio'}
                  size={24}
                  color={isRecording ? colors.destructiveForeground : colors.primaryForeground}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.heroFooter}>
            <View style={styles.liveLine}>
              <View
                style={[
                  styles.liveDot,
                  { backgroundColor: isRecording ? colors.destructive : colors.mutedForeground },
                ]}
              />
              <Text style={[styles.heroMeta, { color: colors.mutedForeground }]}>
                {isRecording ? t('liveCapture') : t('captureStandby')}
              </Text>
            </View>
            <Text style={[styles.heroMeta, { color: colors.mutedForeground }]}>
              {t('k4')}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t('glance')}
          </Text>
          <Pressable onPress={() => router.push('/controls')}>
            <Text style={[styles.link, { color: colors.foreground }]}>
              {t('allControls')} <Feather name="arrow-up-right" size={13} color={colors.foreground} />
            </Text>
          </Pressable>
        </View>
        <View style={styles.grid}>
          <Card style={styles.metricCard}>
            <HardwareIcon kind="camera" color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>
              {cameraOn ? t('on') : t('off')}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {cameraView === 'Wide' ? t('wideCamera') : cameraView === 'Front' ? t('frontCamera') : t('rearCamera')}
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <HardwareIcon kind="actuator" color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>
              {actuatorPosition}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {t('actuatorPosition')}
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <HardwareIcon kind="led" color={ledOn ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>
              {ledOn ? t('on') : t('off')}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {t('visibilityLed')}
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <HardwareIcon kind="obs" color={obsConnected ? colors.success : colors.warning} />
            <Text style={[styles.metricValue, { color: colors.foreground }]}>
              {obsConnected ? 'READY' : t('offline')}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {t('obsStudio')}
            </Text>
          </Card>
        </View>

        <Card style={styles.voiceCard}>
          <View style={styles.voiceCopy}>
            <View style={[styles.voiceIcon, { backgroundColor: colors.accent }]}>
              <HardwareIcon kind="mic" color={colors.accentForeground} />
            </View>
            <View style={styles.voiceText}>
              <Text style={[styles.voiceTitle, { color: colors.foreground }]}>
                {t('handsFree')}
              </Text>
              <Text style={[styles.voiceSubtitle, { color: colors.mutedForeground }]}>
                {t('useVoice')}
              </Text>
            </View>
          </View>
          <Pressable
            testID="voice-command"
            accessibilityRole="button"
            accessibilityLabel="Start voice command"
            onPress={startListening}
            style={({ pressed }) => [
              styles.micButton,
              { backgroundColor: colors.secondary },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="mic" size={19} color={colors.foreground} />
          </Pressable>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 18, paddingHorizontal: 20 },
  topbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.7 },
  hero: { borderRadius: 27, gap: 26, minHeight: 235, overflow: 'hidden', padding: 20 },
  heroHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  heroLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heroName: { fontFamily: 'Inter_600SemiBold', fontSize: 17, marginTop: 7 },
  timerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  timer: { fontFamily: 'Inter_700Bold', fontSize: 52, letterSpacing: -2.5 },
  timerCaption: { fontSize: 13, marginTop: -3 },
  recordButton: { alignItems: 'center', borderRadius: 42, height: 78, justifyContent: 'center', width: 78 },
  recordInner: { alignItems: 'center', borderRadius: 30, borderWidth: 1.5, height: 56, justifyContent: 'center', width: 56 },
  heroFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  liveLine: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  liveDot: { borderRadius: 5, height: 8, width: 8 },
  heroMeta: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  sectionHead: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, letterSpacing: -0.3 },
  link: { fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { flexBasis: '48%', flexGrow: 1, gap: 7, minHeight: 115 },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.7, marginTop: 3 },
  metricLabel: { fontSize: 12 },
  voiceCard: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  voiceCopy: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: 12 },
  voiceIcon: { alignItems: 'center', borderRadius: 15, height: 42, justifyContent: 'center', width: 42 },
  voiceText: { gap: 3 },
  voiceTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  voiceSubtitle: { fontSize: 12 },
  micButton: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
