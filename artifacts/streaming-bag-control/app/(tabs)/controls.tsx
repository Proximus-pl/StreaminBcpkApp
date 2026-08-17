import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Divider, Eyebrow, HardwareIcon, IconSquare, StatusPill } from '@/components/Controls';
import { useBag } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';

export default function ControlsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cameraOn, cameraView, actuatorPosition, ledOn, isListening, lastVoiceCommand, toggleCamera, switchCamera, moveActuator, toggleLed, startListening } = useBag();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><View><Text style={[styles.kicker, { color: colors.primary }]}>HARDWARE / 02</Text><Text style={[styles.title, { color: colors.foreground }]}>Bag controls</Text></View><IconSquare icon="more-horizontal" onPress={() => undefined} accessibilityLabel="More controls" /></View>

        <Card style={styles.controlCard}>
          <View style={styles.controlTop}><View style={styles.controlTitleRow}><View style={[styles.controlIcon, { backgroundColor: colors.accent }]}><HardwareIcon kind="camera" color={colors.accentForeground} /></View><View><Text style={[styles.controlTitle, { color: colors.foreground }]}>Camera system</Text><Text style={[styles.controlDetail, { color: colors.mutedForeground }]}>Primary capture module</Text></View></View><StatusPill label={cameraOn ? 'ACTIVE' : 'OFF'} active={cameraOn} /></View>
          <Divider />
          <View style={styles.cameraActions}><Text style={[styles.valueLabel, { color: colors.mutedForeground }]}>CURRENT VIEW</Text><Text style={[styles.cameraView, { color: colors.foreground }]}>{cameraView}</Text><Pressable testID="switch-camera" accessibilityRole="button" accessibilityLabel="Switch camera view" onPress={switchCamera} style={({ pressed }) => [styles.outlineButton, { borderColor: colors.border }, pressed && styles.pressed]}><Ionicons name="swap-horizontal" size={17} color={colors.foreground} /><Text style={[styles.buttonText, { color: colors.foreground }]}>Switch view</Text></Pressable></View>
          <View style={styles.cameraBottom}><Text style={[styles.helper, { color: colors.mutedForeground }]}>4K · 30 FPS · H.264</Text><Pressable testID="toggle-camera" accessibilityRole="button" accessibilityLabel={cameraOn ? 'Turn camera off' : 'Turn camera on'} onPress={toggleCamera} style={({ pressed }) => [styles.toggle, { backgroundColor: cameraOn ? colors.primary : colors.secondary }, pressed && styles.pressed]}><View style={[styles.toggleKnob, { backgroundColor: cameraOn ? colors.primaryForeground : colors.mutedForeground, transform: [{ translateX: cameraOn ? 16 : 0 }] }]} /></Pressable></View>
        </Card>

        <Card style={styles.controlCard}>
          <View style={styles.controlTop}><View style={styles.controlTitleRow}><View style={[styles.controlIcon, { backgroundColor: colors.accent }]}><HardwareIcon kind="actuator" color={colors.accentForeground} /></View><View><Text style={[styles.controlTitle, { color: colors.foreground }]}>Actuator arm</Text><Text style={[styles.controlDetail, { color: colors.mutedForeground }]}>Physical camera lift</Text></View></View><Text style={[styles.percent, { color: colors.foreground }]}>{actuatorPosition}%</Text></View>
          <View style={[styles.track, { backgroundColor: colors.secondary }]}><View style={[styles.trackFill, { backgroundColor: colors.primary, width: `${actuatorPosition}%` }]} /></View>
          <View style={styles.actuatorActions}><Pressable testID="actuator-out" accessibilityRole="button" accessibilityLabel="Move actuator out" onPress={() => moveActuator(10)} style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Feather name="arrow-up" size={17} color={colors.foreground} /><Text style={[styles.buttonText, { color: colors.foreground }]}>Move out</Text></Pressable><Pressable testID="actuator-in" accessibilityRole="button" accessibilityLabel="Move actuator in" onPress={() => moveActuator(-10)} style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Feather name="arrow-down" size={17} color={colors.foreground} /><Text style={[styles.buttonText, { color: colors.foreground }]}>Move in</Text></Pressable></View>
        </Card>

        <Card style={styles.controlCard}>
          <View style={styles.controlTop}><View style={styles.controlTitleRow}><View style={[styles.controlIcon, { backgroundColor: colors.accent }]}><HardwareIcon kind="led" color={colors.accentForeground} /></View><View><Text style={[styles.controlTitle, { color: colors.foreground }]}>Visibility LED</Text><Text style={[styles.controlDetail, { color: colors.mutedForeground }]}>Shows who is recording</Text></View></View><StatusPill label={ledOn ? 'ON' : 'OFF'} active={ledOn} /></View>
          <Divider />
          <View style={styles.ledRow}><View><Text style={[styles.ledTitle, { color: colors.foreground }]}>Darkness assist</Text><Text style={[styles.controlDetail, { color: colors.mutedForeground }]}>Turns on automatically below 20 lux</Text></View><Pressable testID="toggle-led" accessibilityRole="button" accessibilityLabel={ledOn ? 'Turn visibility LED off' : 'Turn visibility LED on'} onPress={toggleLed} style={({ pressed }) => [styles.toggle, { backgroundColor: ledOn ? colors.primary : colors.secondary }, pressed && styles.pressed]}><View style={[styles.toggleKnob, { backgroundColor: ledOn ? colors.primaryForeground : colors.mutedForeground, transform: [{ translateX: ledOn ? 16 : 0 }] }]} /></Pressable></View>
        </Card>

        <Pressable testID="voice-control" accessibilityRole="button" accessibilityLabel="Listen for a voice command" onPress={startListening} style={({ pressed }) => [styles.voicePanel, { backgroundColor: colors.deep }, pressed && styles.pressed]}><View style={[styles.voiceOrb, { backgroundColor: isListening ? colors.primary : colors.accent }]}><Ionicons name="mic" size={23} color={isListening ? colors.primaryForeground : colors.accentForeground} /></View><View style={styles.voicePanelCopy}><Text style={[styles.voicePanelTitle, { color: colors.deepForeground }]}>{isListening ? 'Listening now…' : 'Voice command'}</Text><Text style={[styles.voicePanelDetail, { color: colors.mutedForeground }]}>{lastVoiceCommand}</Text></View><Feather name="chevron-right" size={19} color={colors.mutedForeground} /></Pressable>
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
  controlCard: { gap: 14 },
  controlTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  controlTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  controlIcon: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  controlTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  controlDetail: { fontSize: 12, marginTop: 4 },
  percent: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  divider: { marginVertical: 1 },
  cameraActions: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  valueLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginRight: 'auto' },
  cameraView: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  outlineButton: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 11, paddingVertical: 9 },
  buttonText: { fontSize: 12, fontWeight: '700' },
  cameraBottom: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  helper: { fontSize: 11 },
  toggle: { borderRadius: 20, height: 25, justifyContent: 'center', paddingHorizontal: 4, width: 45 },
  toggleKnob: { borderRadius: 9, height: 17, width: 17 },
  track: { borderRadius: 5, height: 8, overflow: 'hidden', width: '100%' },
  trackFill: { borderRadius: 5, height: 8 },
  actuatorActions: { flexDirection: 'row', gap: 10 },
  actionButton: { alignItems: 'center', borderRadius: 12, flex: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', paddingVertical: 12 },
  ledRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  ledTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  voicePanel: { alignItems: 'center', borderRadius: 20, flexDirection: 'row', gap: 12, padding: 15 },
  voiceOrb: { alignItems: 'center', borderRadius: 20, height: 44, justifyContent: 'center', width: 44 },
  voicePanelCopy: { flex: 1, gap: 4 },
  voicePanelTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  voicePanelDetail: { fontSize: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});