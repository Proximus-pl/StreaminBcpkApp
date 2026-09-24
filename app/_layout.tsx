import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
// Import useRootNavigationState to ensure router is ready
import { Stack, router, useSegments, useRootNavigationState } from 'expo-router'; 
import * as SplashScreen from 'expo-splash-screen';
import { BagProvider } from '@/context/BagContext';
import { DrawerProvider } from '@/context/DrawerContext';
import { AppDrawer } from '@/components/AppDrawer';
import { LanguageProvider } from '@/hooks/useLanguage';
import { ThemeProvider } from '@/hooks/useTheme';
import { supabase } from '@/utils/supabase';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState(); // Tracks if the router is awake
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Crucial fix: Do nothing until the navigation state is fully mounted
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthScreen = segments[0] === 'login' || segments[0] === 'signup';

    if (!session && !inAuthScreen) {
      router.replace('/login');
    } else if (session && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [session, isReady, segments, rootNavigationState]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
      </Stack>
      <AppDrawer />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <DrawerProvider>
                <BagProvider>
                  <GestureHandlerRootView>
                    <KeyboardProvider>
                      <RootLayoutNav />
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </BagProvider>
              </DrawerProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}