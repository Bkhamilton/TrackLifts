import { DataContextProvider } from '@/contexts/DataContext';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <DataContextProvider>
            <Stack>
                <Stack.Screen name="main" options={{ headerShown: false }} />
                <Stack.Screen name="profileInfo" options={{ headerShown: false }} />
                <Stack.Screen name="data" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
            </Stack>
        </DataContextProvider>
    );
}