import { Text, View } from '@/components/Themed';
import { ActiveExercise } from '@/utils/types';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import SetCard from './SetCard';

interface WorkoutInfoProps {
    exercise: ActiveExercise;
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    onAddSet: (exerciseId: number) => void;
    onToggleComplete: (exerciseId: number, setId: number) => void;
    onDeleteSet: (exerciseId: number, setId: number) => void;
    completedSets: number[];
}

export default function WorkoutInfo({ 
    exercise, 
    onUpdateSet, 
    onAddSet,
    onToggleComplete,
    onDeleteSet,
    completedSets 
}: WorkoutInfoProps) {
    const [editingSet, setEditingSet] = useState<number | null>(null);

    return (
        <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
            
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>Set</Text>
                <Text style={styles.headerText}>Weight</Text>
                <Text style={styles.headerText}>Reps</Text>
                <View style={{ width: 24 }}></View>
            </View>
            
            {/* Sets List */}
            {exercise.sets.map((set) => (
                <SetCard 
                    key={set.id} 
                    set={set} 
                    onUpdateSet={onUpdateSet} 
                    editingSet={editingSet} 
                    setEditingSet={setEditingSet}
                    onToggleComplete={(setId) => onToggleComplete(exercise.id, setId)}
                    onDeleteSet={(setId) => onDeleteSet(exercise.id, setId)}
                    isCompleted={completedSets.includes(set.id)}
                />
            ))}
            
            {/* Add Set Button */}
            <TouchableOpacity 
                onPress={() => onAddSet(exercise.id)}
                style={styles.addSetButton}
            >
                <Text style={styles.addSetButtonText}>+ Add Set</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    addSetButton: {
        marginTop: 10,
        paddingVertical: 8,
        backgroundColor: '#ff8787',
        borderRadius: 5,
        alignItems: 'center',
    },
    addSetButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});