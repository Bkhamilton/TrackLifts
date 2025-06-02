import { Text, View } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

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
    onClose: () => void;
}

export default function EditSplitModal({
    visible,
    editingSplit,
    availableRoutines,
    onUpdateSplitDay,
    onClose,
}: EditSplitModalProps) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit {editingSplit.name}</Text>

                    {editingSplit.routines.map((day, index) => (
                        <View key={index} style={styles.dayRow}>
                            <Text style={styles.dayLabel}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.day - 1]}
                            </Text>
                            <Picker
                                selectedValue={day.routine}
                                style={styles.picker}
                                onValueChange={(value) => onUpdateSplitDay(editingSplit.id, day.day, value)}
                            >
                                {availableRoutines.map((routine, i) => (
                                    <Picker.Item key={i} label={routine} value={routine} />
                                ))}
                            </Picker>
                        </View>
                    ))}

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
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#666',
    },
    picker: {
        flex: 1,
        height: 40,
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
});
