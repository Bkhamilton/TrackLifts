import { ClearView, Text, TextInput, View } from '@/components/Themed';
import { ActiveSet } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    index: number; // Add this prop
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    editingSet: number | null;
    setEditingSet: React.Dispatch<React.SetStateAction<number | null>>;
    onToggleComplete?: (setId: number) => void;
    isCompleted?: boolean;
    onDeleteSet: (setId: number) => void;
}

export default function SetCard({ 
    set, 
    index, // Add this to destructuring
    onUpdateSet, 
    editingSet, 
    setEditingSet,
    onToggleComplete,
    isCompleted = false,
    onDeleteSet
}: SetCardProps) {

    const cardBackground = useThemeColor({}, 'grayBorder');

    return (
        <View style={[
            styles.setContainer,
            isCompleted && styles.completedSet,
            !isCompleted && { backgroundColor: cardBackground }
        ]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.setNumber, isCompleted && styles.completedNumber]}>#{index + 1}</Text>
                
                {/* Rest of the component remains the same */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={set.weight.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'weight', value)}
                        keyboardType="decimal-pad"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>lbs</Text>
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

                <ClearView style={styles.actionsContainer}>
                    {
                        onToggleComplete && (
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
                        )
                    }
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
                </ClearView>
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
        borderRadius: 4,
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
        color: '#555',
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
    completedNumber: {
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