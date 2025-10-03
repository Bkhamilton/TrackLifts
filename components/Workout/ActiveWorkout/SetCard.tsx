import { ClearView, Text, TextInput, View } from '@/components/Themed';
import { ActiveSet } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    index: number; // Add this prop
    equipment: string; // Add equipment type prop
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
    equipment, // Add equipment to destructuring
    onUpdateSet, 
    editingSet, 
    setEditingSet,
    onToggleComplete,
    isCompleted = false,
    onDeleteSet
}: SetCardProps) {

    const cardBackground = useThemeColor({}, 'grayBorder');
    
    // Local state for input values to handle partial decimals
    const [weightInput, setWeightInput] = useState(set.weight.toString());
    const [repsInput, setRepsInput] = useState(set.reps.toString());

    // Sync local state with prop changes when not editing
    useEffect(() => {
        if (editingSet !== set.id) {
            setWeightInput(set.weight.toString());
            setRepsInput(set.reps.toString());
        }
    }, [set.weight, set.reps, editingSet, set.id]);

    const handleWeightChange = (value: string) => {
        // Allow empty, digits, and a single decimal point
        // For Assisted Bodyweight, also allow negative values (minus sign at start)
        const isAssistedBodyweight = equipment === 'Assisted Bodyweight';
        const regex = isAssistedBodyweight ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
        
        if (value === '' || regex.test(value)) {
            setWeightInput(value);
            onUpdateSet(set.id, 'weight', value);
        }
    };

    const handleRepsChange = (value: string) => {
        // Allow empty and digits only (no decimals for reps)
        if (value === '' || /^\d+$/.test(value)) {
            setRepsInput(value);
            onUpdateSet(set.id, 'reps', value);
        }
    };

    return (
        <View style={[
            styles.setContainer,
            isCompleted && styles.completedSet,
            !isCompleted && { backgroundColor: cardBackground }
        ]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.setNumber, isCompleted && styles.completedNumber]}>#{index + 1}</Text>
                
                {/* Weight input with equipment-specific display */}
                <View style={styles.inputContainer}>
                    {equipment === 'Assisted Bodyweight' && (
                        <Text style={styles.assistancePrefix}>-</Text>
                    )}
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={weightInput}
                        onChangeText={handleWeightChange}
                        keyboardType={equipment === 'Assisted Bodyweight' ? 'numeric' : 'decimal-pad'}
                        placeholder={equipment === 'Bodyweight' ? '0' : ''}
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>{equipment === 'Bodyweight' || equipment === 'Assisted Bodyweight' ? 'lbs' : 'lbs'}</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={repsInput}
                        onChangeText={handleRepsChange}
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
    assistancePrefix: {
        fontSize: 16,
        color: '#555',
        marginRight: 2,
        fontWeight: '500',
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