import { Text, View } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity } from 'react-native';

interface RoutineDay {
    day: number;
    routine: string;
}

interface Split {
    id: number;
    name: string;
    routines: RoutineDay[];
}

interface EditSplitModalProps {
    visible: boolean;
    editingSplit: Split;
    availableRoutines: string[];
    onUpdateSplitDay: (splitId: number, day: number, routine: string) => void;
    onAddDay: (splitId: number) => void;
    onRemoveDay: (splitId: number, day: number) => void;
    onClose: () => void;
}

export default function EditSplitModal({
    visible,
    editingSplit,
    availableRoutines,
    onUpdateSplitDay,
    onAddDay,
    onRemoveDay,
    onClose,
}: EditSplitModalProps) {
    const [activePicker, setActivePicker] = useState<number | null>(null);
    const [expandedPicker, setExpandedPicker] = useState<number | null>(null);

    const handleDayPress = (dayNumber: number) => {
        if (expandedPicker === dayNumber) {
            setExpandedPicker(null);
        } else {
            setExpandedPicker(dayNumber);
        }
    };

    const handleAddDay = () => {
        onAddDay(editingSplit.id);
    };

    const handleRemoveDay = (dayNumber: number) => {
        onRemoveDay(editingSplit.id, dayNumber);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit {editingSplit.name}</Text>

                    {editingSplit.routines.map((day) => (
                        <View key={day.day} style={styles.dayRow}>
                            <Text style={styles.dayLabel}>Day {day.day}</Text>
                            
                            {expandedPicker === day.day ? (
                                <Picker
                                    selectedValue={day.routine}
                                    style={styles.picker}
                                    onValueChange={(value) => {
                                        onUpdateSplitDay(editingSplit.id, day.day, value);
                                        setExpandedPicker(null);
                                    }}
                                >
                                    {availableRoutines.map((routine, i) => (
                                        <Picker.Item key={i} label={routine} value={routine} />
                                    ))}
                                </Picker>
                            ) : (
                                <TouchableOpacity 
                                    style={styles.routineValue}
                                    onPress={() => handleDayPress(day.day)}
                                >
                                    <Text>{day.routine}</Text>
                                </TouchableOpacity>
                            )}
                            
                            {editingSplit.routines.length > 1 && (
                                <TouchableOpacity 
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveDay(day.day)}
                                >
                                    <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity 
                        style={styles.addDayButton}
                        onPress={handleAddDay}
                    >
                        <Text style={styles.addDayButtonText}>+ Add Day</Text>
                    </TouchableOpacity>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    dayLabel: {
        fontSize: 14,
        fontWeight: '500',
        width: 60,
    },
    routineValue: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginHorizontal: 8,
    },
    picker: {
        flex: 1,
        height: Platform.OS === 'ios' ? 120 : 40,
        marginHorizontal: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    addDayButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    addDayButtonText: {
        color: '#333',
    },
    removeButton: {
        padding: 4,
        marginLeft: 8,
    },
    removeButtonText: {
        fontSize: 18,
        color: 'red',
    },
});