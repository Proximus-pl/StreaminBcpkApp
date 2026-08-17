import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Eyebrow, StatusPill } from '@/components/Controls';
import { useBag, type ActivityItem } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';

function ActivityIcon({ kind, color }: { kind: ActivityItem['kind']; color: string }) {
  if (kind === 'recording') return <Ionicons name="radio-outline" size={19} color={color} />;
  if (kind === 'camera') return <Ionicons name="videocam-outline" size={19} color={color} />;
  if (kind === 'actuator') return <MaterialCommunityIcons name="arrow-expand-vertical" size={19} color={color} />;
  if (kind === 'voice') return <Ionicons name="mic-outline" size={19} color={color} />;
  return <Feather name="activity" size={19} color={color} />;
}

export default function ActivityScreen() {
  const colors = useColors();
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
        ListHeaderComponent={<><View style={styles.header}><View><Text style={[styles.kicker, { color: colors.primary }]}>TIMELINE / 03</Text><Text style={[styles.title, { color: colors.foreground }]}>Activity</Text></View><StatusPill label={isRecording ? `${recordingSeconds}s LIVE` : 'IDLE'} active={isRecording} /></View><Card style={styles.summary}><View><Eyebrow>SESSION STATUS</Eyebrow><Text style={[styles.summaryTitle, { color: colors.foreground }]}>{isRecording ? 'Capturing your stream' : 'Ready for your next take'}</Text><Text style={[styles.summaryDetail, { color: colors.mutedForeground }]}>Every control action appears here</Text></View><View style={[styles.summaryMark, { backgroundColor: isRecording ? colors.destructive : colors.primary }]}><Feather name={isRecording ? 'radio' : 'check'} size={20} color={isRecording ? colors.destructiveForeground : colors.primaryForeground} /></View></Card><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent activity</Text></>}
        ListEmptyComponent={<Card><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No activity yet</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Your bag events will appear here.</Text></Card>}
        renderItem={({ item }) => <View style={styles.item}><View style={[styles.itemIcon, { backgroundColor: colors.secondary }]}><ActivityIcon kind={item.kind} color={colors.foreground} /></View><View style={styles.itemCopy}><Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.itemDetail, { color: colors.mutedForeground }]}>{item.detail}</Text></View><Text style={[styles.itemTime, { color: colors.mutedForeground }]}>{item.time}</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 16, paddingHorizontal: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
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