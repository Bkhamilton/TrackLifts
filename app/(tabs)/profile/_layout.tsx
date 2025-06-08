import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="main" options={{ headerShown: false }} />
            <Stack.Screen name="profileInfo" options={{ headerShown: false }} />
            <Stack.Screen name="data" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
    );
}