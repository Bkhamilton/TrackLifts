import { initializeDatabase } from '@/api/startup';
import { ActiveWorkoutContextProvider } from '@/contexts/ActiveWorkoutContext';
import { DBContextProvider } from '@/contexts/DBContext';
import { ExerciseContextProvider } from '@/contexts/ExerciseContext';
import { RoutineContextProvider } from '@/contexts/RoutineContext';
import { SplitContextProvider } from '@/contexts/SplitContext';
import { UserContextProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    LogBox.ignoreLogs([
        'Attempted to import the module "C:\\Users\\bkham\\Coding\\Mobile Apps\\workout-app\\node_modules\\victory-native"',
    ]);

    return (
        <SQLiteProvider databaseName='workout-tracker.db' onInit={initializeDatabase} useSuspense>
            <DBContextProvider>
                <UserContextProvider>
                    <ExerciseContextProvider>
                        <RoutineContextProvider>
                            <SplitContextProvider>
                                <ActiveWorkoutContextProvider>
                                    <RootLayoutNav />
                                </ActiveWorkoutContextProvider>
                            </SplitContextProvider>
                        </RoutineContextProvider>
                    </ExerciseContextProvider>
                </UserContextProvider>
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
                <Stack.Screen name="finishWorkout" options={{ presentation: 'card', headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}