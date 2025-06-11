import { HistoryContextProvider } from '@/contexts/HistoryContext';
import { Stack } from 'expo-router';

export default function HistoryLayout() {
    return (
        <HistoryContextProvider>
            <Stack>
                <Stack.Screen name="main" options={{ headerShown: false }} />
                <Stack.Screen name="editHistory" options={{ headerShown: false }} />
            </Stack>
        </HistoryContextProvider>
    );
}