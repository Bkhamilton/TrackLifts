import { initializeDatabase } from '@/api/startup';
import { ActiveWorkoutContextProvider } from '@/contexts/ActiveWorkoutContext';
import { DBContextProvider } from '@/contexts/DBContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <SQLiteProvider databaseName='workout-tracker.db' onInit={initializeDatabase} useSuspense>
            <DBContextProvider>
                <ActiveWorkoutContextProvider>
                    <RootLayoutNav />
                </ActiveWorkoutContextProvider>
            </DBContextProvider>
        </SQLiteProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="finishWorkout" options={{ presentation: 'card' }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}