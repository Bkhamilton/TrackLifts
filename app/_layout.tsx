import { initializeDatabase } from '@/api/startup';
import { ActiveWorkoutContextProvider } from '@/contexts/ActiveWorkoutContext';
import { DBContextProvider } from '@/contexts/DBContext';
import { ExerciseContextProvider } from '@/contexts/ExerciseContext';
import { RoutineContextProvider } from '@/contexts/RoutineContext';
import { SplitContextProvider } from '@/contexts/SplitContext';
import { UserContext, UserContextProvider } from '@/contexts/UserContext';
import { WorkoutContextProvider } from '@/contexts/WorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useSyncExternalStore } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Workout data lives in browser/native storage, not in the static renderer.
const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default Sentry.wrap(function RootLayout() {
    const isClient = useSyncExternalStore(
        subscribeToHydration,
        getClientSnapshot,
        getServerSnapshot,
    );
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded || (Platform.OS === 'web' && !isClient)) {
        // Initialize local storage providers only after browser hydration.
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
        <SQLiteProvider databaseName='workout-tracker.db' onInit={initializeDatabase} useSuspense>
            <DBContextProvider>
                <UserContextProvider>
                    <ExerciseContextProvider>
                        <RoutineContextProvider>
                            <SplitContextProvider>
                                <WorkoutContextProvider>
                                    <ActiveWorkoutContextProvider>
                                        <RootLayoutNav />
                                    </ActiveWorkoutContextProvider>
                                </WorkoutContextProvider>
                            </SplitContextProvider>
                        </RoutineContextProvider>
                    </ExerciseContextProvider>
                </UserContextProvider>
            </DBContextProvider>
        </SQLiteProvider>
        </KeyboardProvider>
        </GestureHandlerRootView>
    );
});

function RootLayoutNav() {
    const { appearancePreference } = useContext(UserContext);
    const systemColorScheme = useColorScheme() ?? 'light';
    const theme = appearancePreference === 'system' ? systemColorScheme : appearancePreference;

    return (
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="finishWorkout" options={{ presentation: 'card', headerShown: false }} />
                <Stack.Screen name="exportWorkout" options={{ presentation: 'card', headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}