import { Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface WorkoutProps {
    open: () => void;
    routine: ActiveRoutine;
}

export default function WorkoutDisplay({ open, routine }: WorkoutProps) {
    return (
        <View style={styles.container}>
            {routine.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseContainer}>
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                    
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>Set</Text>
                        <Text style={styles.headerText}>Weight</Text>
                        <Text style={styles.headerText}>Reps</Text>
                    </View>
                    
                    {/* Sets List */}
                    {exercise.sets.map((set) => (
                        <View key={set.id} style={styles.setContainer}>
                            <Text style={styles.setNumber}>#{set.set_order}</Text>
                            <Text style={styles.setValue}>{set.weight} kg</Text>
                            <Text style={styles.setValue}>{set.reps} reps</Text>
                        </View>
                    ))}
                </View>
            ))}
            {
                routine.exercises.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#888', paddingVertical: 20 }}>
                        No exercises added yet. Tap the button below to add your first exercise.
                    </Text>
                )
            }
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
    exerciseContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    headerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        flex: 1,
        textAlign: 'center',
    },
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        flex: 1,
    },
    setValue: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        flex: 1,
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