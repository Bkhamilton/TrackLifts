import { Text, TextInput, View } from '@/components/Themed';
import { ActiveExercise, ActiveSet } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface WorkoutInfoProps {
    exercise: ActiveExercise;
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    onAddSet: (exerciseId: number) => void;
}

export default function WorkoutInfo({ exercise, onUpdateSet, onAddSet }: WorkoutInfoProps) {
    const [editingSet, setEditingSet] = useState<number | null>(null);

    function SetCard({ set }: { set: ActiveSet }) {
        return (
            <View style={styles.setContainer}>
                <Text style={styles.setNumber}>#{set.set_order}</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={set.weight.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'weight', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                    />
                    <Text style={styles.unit}>kg</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={set.reps.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'reps', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                    />
                    <Text style={styles.unit}>reps</Text>
                </View>

                <View style={styles.checkContainer}>
                    <MaterialCommunityIcons
                        name={editingSet === set.id ? "pencil" : "check"}
                        size={24}
                        color={editingSet === set.id ? "#007AFF" : "green"}
                    />
                </View>
            </View>
        );
    }

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
                <SetCard key={set.id} set={set} />
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
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 6,
        width: 60,
        textAlign: 'center',
        marginRight: 4,
        backgroundColor: 'white',
    },
    unit: {
        fontSize: 12,
        color: '#777',
    },
    checkContainer: {
        width: 24,
        alignItems: 'center',
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