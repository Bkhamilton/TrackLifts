import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="splits" options={{ headerShown: false }} />
            <Stack.Screen name="routines" options={{ headerShown: false }} />
            <Stack.Screen name="editRoutine" options={{ headerShown: false }} />
        </Stack>
    );
}