import { Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/constants/types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import WorkoutInfo from './WorkoutInfo';

interface WorkoutProps {
    open: () => void;
    routine: ActiveRoutine;
    onUpdateSet: (exerciseIndex: number, setId: number, field: 'weight' | 'reps', value: string) => void;
    onAddSet: (exerciseIndex: number) => void;
    onDeleteSet: (exerciseIndex: number, setId: number) => void;
    onToggleComplete?: (exerciseIndex: number, setId: number) => void;
    completedSets?: number[];
    onReplaceExercise?: (exerciseIndex: number) => void;
    onRemoveExercise?: (exerciseIndex: number) => void;
}

export default function Workout({ 
    open, 
    routine, 
    onUpdateSet, 
    onAddSet, 
    onDeleteSet,
    onToggleComplete,
    completedSets,
    onReplaceExercise,
    onRemoveExercise
}: WorkoutProps) {

    const handleDeleteSet = (exerciseIndex: number, setId: number) => {
        onDeleteSet(exerciseIndex, setId);
    }

    return (
        <View style={styles.container}>
            {routine.exercises.map((exercise, index) => (
                <WorkoutInfo
                    key={index}
                    exercise={exercise}
                    exerciseIndex={index}
                    onUpdateSet={(setId, field, value) => onUpdateSet(index, setId, field, value)}
                    onAddSet={() => onAddSet(index)}
                    onDeleteSet={(setId) => handleDeleteSet(index, setId)}
                    onToggleComplete={onToggleComplete ? (setId) => onToggleComplete(index, setId) : undefined}
                    completedSets={completedSets}
                    onReplaceExercise={onReplaceExercise ? () => onReplaceExercise(index) : undefined}
                    onRemoveExercise={onRemoveExercise ? () => onRemoveExercise(index) : undefined}
                />
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
    completeButton: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    completeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});