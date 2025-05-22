import { Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import WorkoutInfo from './WorkoutInfo';

interface WorkoutProps {
    open: () => void;
    routine: ActiveRoutine;
    onUpdateSet: (exerciseId: number, setId: number, field: 'weight' | 'reps', value: string) => void;
    onAddSet: (exerciseId: number) => void;
}

export default function Workout({ open, routine, onUpdateSet, onAddSet }: WorkoutProps) {
    return (
        <View style={styles.container}>
            {routine.exercises.map((exercise) => (
                <WorkoutInfo
                    key={exercise.id}
                    exercise={exercise}
                    onUpdateSet={(setId, field, value) => onUpdateSet(exercise.id, setId, field, value)}
                    onAddSet={() => onAddSet(exercise.id)}
                />
            ))}
            <TouchableOpacity onPress={open} style={styles.addExerciseButton}>
                <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    addExerciseButton: {
        padding: 12,
        backgroundColor: '#ff8787',
        borderRadius: 8,
        alignItems: 'center',
    },
    addExerciseButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});