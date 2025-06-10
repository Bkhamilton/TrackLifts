import { Stack } from 'expo-router';

export default function HistoryLayout() {
    return (
        <Stack>
            <Stack.Screen name="main" options={{ headerShown: false }} />
            <Stack.Screen name="editHistory" options={{ headerShown: false }} />
        </Stack>
    );
}