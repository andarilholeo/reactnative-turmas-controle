import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SchoolsProvider } from '@/src/application/contexts/SchoolsContext';

async function prepareMocks() {
  if (!__DEV__) return;
  const { startMockServer } = await import('@/src/infrastructure/mocks/server');
  startMockServer();
}

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [mockReady, setMockReady] = useState(false);

  useEffect(() => {
    prepareMocks().finally(() => setMockReady(true));
  }, []);

  if (!mockReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#5B8A3C" />
      </View>
    );
  }

  return (
    <SchoolsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="schools/[id]" options={{ title: 'Detalhes' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SchoolsProvider>
  );
}
