import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Controls';
import { useBag } from '@/context/BagContext';
import { useColors } from '@/hooks/useColors';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { connectObs } = useBag();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (!email.trim() || !password.trim()) {
      setError('Enter your operator email and password to continue.');
      return;
    }
    connectObs();
    router.back();
  };
  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.nav}><Pressable testID="close-login" accessibilityRole="button" accessibilityLabel="Close login" onPress={() => router.back()}><Feather name="arrow-left" size={21} color={colors.foreground} /></Pressable><Text style={[styles.navTitle, { color: colors.foreground }]}>Account access</Text><View style={{ width: 21 }} /></View>
      <View style={styles.content}>
        <LinearGradient colors={[colors.deep, colors.card]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.brandBlock}><View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Ionicons name="radio" size={25} color={colors.primaryForeground} /></View><Text style={[styles.brandKicker, { color: colors.primary }]}>STREAMING BAG</Text><Text style={[styles.brandTitle, { color: colors.deepForeground }]}>Bring your studio with you.</Text><Text style={[styles.brandDetail, { color: colors.mutedForeground }]}>Sign in to connect this console to OBS Studio and manage your field rig.</Text></LinearGradient>
        <View style={styles.form}><Text style={[styles.formTitle, { color: colors.foreground }]}>Operator login</Text><Text style={[styles.formDetail, { color: colors.mutedForeground }]}>Use the account linked to your OBS workspace.</Text><TextInput testID="login-email" accessibilityLabel="Email address" autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor={colors.mutedForeground} value={email} onChangeText={setEmail} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]} /><TextInput testID="login-password" accessibilityLabel="Password" secureTextEntry placeholder="Password" placeholderTextColor={colors.mutedForeground} value={password} onChangeText={setPassword} style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]} />{error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}<Pressable testID="login-submit" accessibilityRole="button" accessibilityLabel="Continue to OBS Studio" onPress={submit} style={({ pressed }) => [styles.submit, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={[styles.submitText, { color: colors.primaryForeground }]}>Continue to OBS Studio</Text><Feather name="arrow-right" size={18} color={colors.primaryForeground} /></Pressable><Text style={[styles.privacy, { color: colors.mutedForeground }]}>Your connection details stay on this device.</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  navTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  content: { flex: 1, gap: 22, padding: 20 },
  brandBlock: { borderRadius: 25, gap: 10, minHeight: 255, padding: 22 },
  brandMark: { alignItems: 'center', borderRadius: 17, height: 52, justifyContent: 'center', marginBottom: 13, width: 52 },
  brandKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  brandTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1, maxWidth: 270 },
  brandDetail: { fontSize: 13, lineHeight: 19, maxWidth: 290 },
  form: { gap: 12 },
  formTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5 },
  formDetail: { fontSize: 13, marginBottom: 6 },
  input: { borderRadius: 13, borderWidth: 1, fontSize: 14, paddingHorizontal: 14, paddingVertical: 14 },
  error: { fontSize: 12 },
  submit: { alignItems: 'center', borderRadius: 14, flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 3, paddingVertical: 15 },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  privacy: { fontSize: 11, textAlign: 'center' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});