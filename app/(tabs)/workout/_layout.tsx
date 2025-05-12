import { Stack } from 'expo-router';

export default function WorkoutLayout() {
    return (
        <Stack>
            <Stack.Screen name="activeWorkout" options={{ headerShown: false }} />
            <Stack.Screen name="newWorkout" options={{ headerShown: false }} />
        </Stack>
    );
}