import { Text, View } from '@/components/Themed';
import { ActiveExercise } from '@/utils/types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface ExerciseHeaderProps {
    exercise: ActiveExercise;
}

export default function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
    return (
        <View style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseSubtitle}>
                    {exercise.muscleGroup} • {exercise.equipment}
                </Text>
            </View>
            
            <View style={styles.setsContainer}>
                {exercise.sets.map((set) => (
                    <View key={set.id} style={styles.setItem}>
                        <Text style={styles.setNumber}>Set {set.set_order}</Text>
                        <Text style={styles.setDetail}>{set.reps} × {set.weight} lbs</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    exerciseHeader: {
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    exerciseSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    setsContainer: {
        marginTop: 8,
    },
    setItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        fontSize: 14,
        color: '#666',
    },
    setDetail: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
});