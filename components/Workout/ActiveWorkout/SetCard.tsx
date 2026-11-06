import { isHoldExercise } from '@/utils/sorenessModel';
import { SetInputField, ActiveSet } from '@/constants/types';
import { ClearView, Text, TextInput, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    index: number; // Add this prop
    exerciseTitle?: string;
    equipment: string; // Add equipment type prop
    onUpdateSet: (setId: number, field: SetInputField, value: string) => void;
    editingSet: number | null;
    setEditingSet: React.Dispatch<React.SetStateAction<number | null>>;
    onToggleComplete?: (setId: number) => void;
    isCompleted?: boolean;
    onDeleteSet: (setId: number) => void;
}

export default function SetCard({ 
    set, 
    index, // Add this to destructuring
    equipment,
    exerciseTitle,
    onUpdateSet, 
    editingSet, 
    setEditingSet,
    onToggleComplete,
    isCompleted = false,
    onDeleteSet
}: SetCardProps) {

    const cardBackground = useThemeColor({}, 'grayBorder');
    const completedSetBg = useThemeColor({}, 'completedSetBackground');
    const completedInputBg = useThemeColor({}, 'completedInputBackground');
    const completedTextColor = useThemeColor({}, 'completedText');
    
    const hold = isHoldExercise(exerciseTitle);
    const countValue = hold ? set.duration_seconds : set.reps;
    // Keep partial decimals only while editing; otherwise render saved values directly.
    const savedWeight = String(equipment === 'Assisted Bodyweight' ? Math.abs(set.weight) : set.weight);
    const [weightDraft, setWeightInput] = useState(savedWeight);
    const [repsDraft, setRepsInput] = useState(countValue?.toString() ?? '');
    const weightInput = editingSet === set.id ? weightDraft : savedWeight;
    const repsInput = editingSet === set.id ? repsDraft : countValue?.toString() ?? '';
    const beginEditing = () => {
        setWeightInput(savedWeight);
        setRepsInput(countValue?.toString() ?? '');
        setEditingSet(set.id);
    };

    const handleWeightChange = (value: string) => {
        // Allow empty, digits, and a single decimal point
        // Assistance is entered as a positive magnitude; the minus prefix is visual.
        const regex = /^\d*\.?\d*$/;
        
        if (value === '' || regex.test(value)) {
            setWeightInput(value);
            onUpdateSet(set.id, 'weight', value);
        }
    };

    const handleRepsChange = (value: string) => {
        // Allow empty and digits only (no decimals for reps)
        if (value === '' || /^\d+$/.test(value)) {
            setRepsInput(value);
            onUpdateSet(set.id, hold ? 'duration_seconds' : 'reps', value);
        }
    };

    const effortOptions = [null, 5, 3, 1, 0];
    const effortLabels = hold ? ['Not set', 'Easy', 'Moderate', 'Hard', 'At limit']
        : ['Not set', 'Easy (5+ left)', 'Moderate (3 left)', 'Hard (1 left)', 'Failure (0 left)'];
    const effortIndex = effortOptions.indexOf(set.rir ?? null);
    const cycleEffort = () => {
        const next = effortOptions[(effortIndex + 1) % effortOptions.length];
        onUpdateSet(set.id, 'rir', next === null ? '' : String(next));
    };

    return (
        <View style={[
            styles.setContainer,
            isCompleted ? { backgroundColor: completedSetBg } : { backgroundColor: cardBackground }
        ]}>
            <View style={styles.contentContainer}>
                <Text style={[styles.setNumber, isCompleted && { color: completedTextColor }]}>#{index + 1}</Text>
                
                {/* Weight input with equipment-specific display */}
                <View style={styles.inputContainer}>
                    {equipment === 'Assisted Bodyweight' && (
                        <Text style={styles.assistancePrefix}>-</Text>
                    )}
                    <TextInput
                        style={[
                            styles.input, 
                            isCompleted && { backgroundColor: completedInputBg, color: completedTextColor }
                        ]}
                        value={weightInput}
                        onChangeText={handleWeightChange}
                        keyboardType={equipment === 'Assisted Bodyweight' ? 'numeric' : 'decimal-pad'}
                        placeholder={equipment === 'Bodyweight' ? '0' : ''}
                        onFocus={beginEditing}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>lbs</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input, 
                            isCompleted && { backgroundColor: completedInputBg, color: completedTextColor }
                        ]}
                        value={repsInput}
                        onChangeText={handleRepsChange}
                        keyboardType="numeric"
                        onFocus={beginEditing}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>{hold ? 'sec' : 'reps'}</Text>
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
            <ClearView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 8, paddingTop: 6 }}>
                <TouchableOpacity onPress={cycleEffort} disabled={isCompleted}
                    accessibilityLabel={hold ? "Optional hold effort: tap to choose difficulty" : "Optional set effort: tap to choose repetitions left"}>
                    <Text style={{ fontSize: 12 }}>Effort: {effortLabels[effortIndex] ?? `${set.rir} left`} ↻</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onUpdateSet(set.id, 'is_warmup', set.is_warmup ? '0' : '1')}
                    disabled={isCompleted} accessibilityRole="checkbox" accessibilityState={{ checked: Boolean(set.is_warmup) }}>
                    <Text style={{ fontSize: 12 }}>{set.is_warmup ? '☑' : '☐'} Warm-up</Text>
                </TouchableOpacity>
            </ClearView>
            {hold && <Text style={{ fontSize: 11, paddingHorizontal: 8 }}>Enter hold time in seconds. Effort means how close you were to stopping.</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        borderRadius: 4,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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