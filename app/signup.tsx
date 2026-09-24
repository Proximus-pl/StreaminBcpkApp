import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ScrollView, 
  Modal, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/utils/supabase'; // Adjust path if needed

export default function SignupScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // New state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

const submit = async () => {
  // Basic validation
  if (!email.trim() || !password.trim() || !confirmPassword.trim() || !phone.trim() || !city.trim()) {
    setError(t('allFieldsRequired') || 'All fields are required.');
    return;
  }
  
  // Length check
  if (password.length < 8) {
    setError(t('passwordTooShort') || 'Password must be at least 8 characters long.');
    return;
  }

  // Special character check (matches anything that is NOT a letter or number)
  const specialCharRegex = /[^a-zA-Z0-9]/;
  if (!specialCharRegex.test(password)) {
    setError(t('passwordNoSpecial') || 'Password must contain at least one special mark.');
    return;
  }
  
  if (password !== confirmPassword) {
    setError(t('passwordsDoNotMatch'));
    return;
  }

  setError('');

  // 1. Register the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim(),
    password: password,
  });

  if (authError) {
    setError(authError.message);
    return;
  }

  // 2. Insert extra details into your custom user_profile table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('user_profile')
      .insert([
        {
          id: authData.user.id,
          email: email.trim(),
          phone_number: phone.trim(),
          city: city.trim(),
        }
      ]);

    if (profileError) {
      setError(profileError.message);
      return;
    }
  }
  
  // 3. Immediately sign out to prevent the RootLayout from auto-redirecting
  await supabase.auth.signOut();
  
  // 4. On complete success, show the confirmation modal
  setModalVisible(true);
};

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.nav}>
        <Pressable testID="close-signup" accessibilityRole="button" accessibilityLabel={t('accountAccess')} onPress={() => router.back()}>
          <Feather name="arrow-left" size={21} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>{t('createAccount')}</Text>
        <View style={{ width: 21 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={[colors.deep, colors.card]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.brandBlock}>
            <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
              <Ionicons name="person-add" size={22} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.brandKicker, { color: colors.primary }]}>{t('streamingBag')}</Text>
            <Text style={[styles.brandTitle, { color: colors.deepForeground }]}>{t('welcomeAboard')}</Text>
            <Text style={[styles.brandDetail, { color: colors.mutedForeground }]}>{t('signupDescription')}</Text>
          </LinearGradient>

          <View style={styles.form}>
            <TextInput 
              testID="signup-email" 
              accessibilityLabel={t('emailAddress')} 
              autoCapitalize="none" 
              keyboardType="email-address" 
              placeholder={t('emailAddress')} 
              placeholderTextColor={colors.mutedForeground} 
              value={email} 
              onChangeText={setEmail} 
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]} 
            />
            <TextInput 
              testID="signup-phone" 
              accessibilityLabel={t('phoneNumber')} 
              keyboardType="phone-pad" 
              placeholder={t('phoneNumber')} 
              placeholderTextColor={colors.mutedForeground} 
              value={phone} 
              onChangeText={setPhone} 
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]} 
            />
            <TextInput 
              testID="signup-city" 
              accessibilityLabel={t('city')} 
              placeholder={t('city')} 
              placeholderTextColor={colors.mutedForeground} 
              value={city} 
              onChangeText={setCity} 
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]} 
            />
            
            {/* Password Input with Toggle */}
            <View style={[styles.passwordWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput 
                testID="signup-password" 
                accessibilityLabel={t('password')} 
                secureTextEntry={!showPassword} 
                placeholder={t('password')} 
                placeholderTextColor={colors.mutedForeground} 
                value={password} 
                onChangeText={setPassword} 
                style={[styles.passwordInput, { color: colors.foreground }]} 
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {/* Confirm Password Input with Toggle */}
            <View style={[styles.passwordWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput 
                testID="signup-confirm-password" 
                accessibilityLabel={t('confirmPassword')} 
                secureTextEntry={!showPassword} 
                placeholder={t('confirmPassword')} 
                placeholderTextColor={colors.mutedForeground} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                style={[styles.passwordInput, { color: colors.foreground }]} 
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}

            <Pressable testID="signup-submit" accessibilityRole="button" accessibilityLabel={t('register')} onPress={submit} style={({ pressed }) => [styles.submit, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>{t('register')}</Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </Pressable>
            
            <Text style={[styles.privacy, { color: colors.mutedForeground, marginTop: 10 }]}>{t('privacy')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={[styles.modalIconWrap, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={32} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t('registrationSuccess')}</Text>
            <Text style={[styles.modalDetail, { color: colors.mutedForeground }]}>{t('readyToLogin')}</Text>
            
            <Pressable 
              onPress={() => {
                setModalVisible(false);
                router.replace('/login'); 
              }} 
              style={({ pressed }) => [styles.submit, { backgroundColor: colors.primary, width: '100%', marginTop: 10 }, pressed && styles.pressed]}
            >
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>{t('goToLogin')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  navTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  content: { flexGrow: 1, gap: 22, padding: 20, paddingBottom: 40 },
  brandBlock: { borderRadius: 25, gap: 10, minHeight: 220, padding: 22 },
  brandMark: { alignItems: 'center', borderRadius: 17, height: 52, justifyContent: 'center', marginBottom: 13, width: 52 },
  brandKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  brandTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -1, maxWidth: 270 },
  brandDetail: { fontSize: 13, lineHeight: 19, maxWidth: 290 },
  form: { gap: 12 },
  input: { borderRadius: 13, borderWidth: 1, fontSize: 14, paddingHorizontal: 14, paddingVertical: 14 },
  
  // New styles for password inputs with icons
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 13, borderWidth: 1, paddingLeft: 14, paddingRight: 4 },
  passwordInput: { flex: 1, fontSize: 14, paddingVertical: 14 },
  eyeButton: { padding: 10 },
  
  error: { fontSize: 12, marginTop: -4, marginBottom: 4 },
  submit: { alignItems: 'center', borderRadius: 14, flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 3, paddingVertical: 15 },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  privacy: { fontSize: 11, textAlign: 'center' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 8, textAlign: 'center' },
  modalDetail: { fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
});