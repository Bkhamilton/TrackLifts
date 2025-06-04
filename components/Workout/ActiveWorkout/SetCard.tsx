import { Text, TextInput, View } from '@/components/Themed';
import { ActiveSet } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    editingSet: number | null;
    setEditingSet: React.Dispatch<React.SetStateAction<number | null>>;
    onToggleComplete: (setId: number) => void;
    isCompleted: boolean;
    onDeleteSet: (setId: number) => void;
}

export default function SetCard({ 
    set, 
    onUpdateSet, 
    editingSet, 
    setEditingSet,
    onToggleComplete,
    isCompleted,
    onDeleteSet
}: SetCardProps) {
    return (
        <View style={[
            styles.setContainer,
            isCompleted && styles.completedSet,
        ]}>
            <View style={styles.contentContainer}>
                <Text style={styles.setNumber}>#{set.set_order}</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={set.weight.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'weight', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>kg</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={set.reps.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'reps', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>reps</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        onPress={() => onToggleComplete(set.id)}
                        style={styles.checkButton}
                    >
                        <MaterialCommunityIcons
                            name={isCompleted ? "check-circle" : (editingSet === set.id ? "pencil" : "circle-outline")}
                            size={24}
                            color={isCompleted ? "green" : (editingSet === set.id ? "#007AFF" : "#aaa")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onDeleteSet(set.id)}
                        style={styles.deleteButton}
                    >
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={20}
                            color="#ff6b6b"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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
    completedSet: {
        backgroundColor: '#f0fff0',
    },
    completedInput: {
        backgroundColor: '#e0ffe0',
        color: '#555',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
        justifyContent: 'flex-end',
    },
    checkButton: {
        marginRight: 12,
    },
    deleteButton: {
        padding: 4,
    },
});