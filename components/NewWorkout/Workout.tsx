import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import WorkoutInfo from './WorkoutInfo';

export default function Workout({ open, routine }: { open?: Function, routine: RoutineList }) {
    const exerciseComponents = routine.exercises.map((type) => (
        <View style={{ paddingVertical: 4 }} key={type.id}>
            <WorkoutInfo
                exercise={type}
                sets={[
                    {
                        number: 1,
                        weight: 100,
                        reps: 10,
                    },
                ]}
            />
        </View>
    ));

    return (
        <View style={{ width: 350 }}>
            {exerciseComponents}
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={open}
            >
                <View style={styles.workoutButton}>
                    <Text style={styles.workoutButtonText}>Add Exercise</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    workoutButton: {
        width: '100%',
        top: 8,
        height: 28,
        borderRadius: 5,
        backgroundColor: '#ff8787',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workoutButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    addSetButton: {
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#ff8787',
    },
});
