import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  const colors = useColors();
  return <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{children}</Text>;
}

export function StatusPill({ label, active = false, warning = false }: { label: string; active?: boolean; warning?: boolean }) {
  const colors = useColors();
  const tone = warning ? colors.warning : active ? colors.success : colors.mutedForeground;
  return (
    <View style={[styles.pill, { backgroundColor: `${tone}20` }]}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <Text style={[styles.pillText, { color: tone }]}>{label}</Text>
    </View>
  );
}

export function IconSquare({
  icon,
  onPress,
  active = false,
  accessibilityLabel,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  active?: boolean;
  accessibilityLabel: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={accessibilityLabel}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconSquare, { backgroundColor: active ? colors.primary : colors.secondary }, pressed && styles.pressed]}
    >
      <Feather name={icon} size={19} color={active ? colors.primaryForeground : colors.foreground} />
    </Pressable>
  );
}

export function HardwareIcon({ kind, color }: { kind: 'camera' | 'led' | 'actuator' | 'mic' | 'obs'; color: string }) {
  if (kind === 'camera') return <Ionicons name="videocam-outline" size={22} color={color} />;
  if (kind === 'led') return <Ionicons name="flash-outline" size={22} color={color} />;
  if (kind === 'actuator') return <MaterialCommunityIcons name="arrow-expand-vertical" size={22} color={color} />;
  if (kind === 'mic') return <Ionicons name="mic-outline" size={22} color={color} />;
  return <MaterialCommunityIcons name="broadcast" size={22} color={color} />;
}

export function Divider() {
  const colors = useColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, padding: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.3, textTransform: 'uppercase' },
  pill: { alignItems: 'center', borderRadius: 20, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  dot: { borderRadius: 5, height: 7, width: 7 },
  pillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  iconSquare: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  divider: { height: 1, marginVertical: 14 },
});