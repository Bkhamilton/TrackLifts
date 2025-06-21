import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveRoutine, Splits } from '@/utils/types';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import RoutineSelectModal from '../RoutineSelectModal';
import TitleChangeModal from '../TitleChangeModal';

interface RoutineDay {
    day: number;
    routine: string;
}

interface EditSplitModalProps {
    visible: boolean;
    editingSplit: Splits;
    availableRoutines: ActiveRoutine[];
    onUpdateSplit: (split: Splits) => void;
    onClose: () => void;
}

export default function EditSplitModal({
    visible,
    editingSplit,
    availableRoutines,
    onUpdateSplit,
    onClose,
}: EditSplitModalProps) {
    const [localSplit, setLocalSplit] = useState<Splits | null>(null);
    const [expandedPicker, setExpandedPicker] = useState<number | null>(null);
    const [titleModalVisible, setTitleModalVisible] = useState(false);

    // When modal opens or editingSplit changes, copy it to local state
    useEffect(() => {
        if (visible && editingSplit) {
            setLocalSplit(JSON.parse(JSON.stringify(editingSplit)));
        }
    }, [visible, editingSplit]);

    if (!localSplit) return null;

    const handleDayPress = (dayNumber: number) => {
        setExpandedPicker(expandedPicker === dayNumber ? null : dayNumber);
    };

    const handleRoutineSelect = (dayNumber: number, routineObj: ActiveRoutine) => {
        setLocalSplit(split => ({
            ...split!,
            routines: split!.routines.map(d =>
                d.day === dayNumber
                    ? { ...d, routine: routineObj.title, routine_id: routineObj.id }
                    : d
            ),
        }));
        setExpandedPicker(null);
    };

    const handleAddDay = () => {
        const newDayNumber =
            localSplit.routines.length > 0
                ? Math.max(...localSplit.routines.map(d => d.day)) + 1
                : 1;
        setLocalSplit(split => ({
            ...split!,
            routines: [
                ...split!.routines,
                {
                    id: 0,
                    split_id: split!.id,
                    day: newDayNumber,
                    routine_id: 1,
                    routine: 'Rest',
                },
            ],
        }));
    };

    const handleRemoveDay = (dayNumber: number) => {
        setLocalSplit(split => ({
            ...split!,
            routines: split!.routines.filter(d => d.day !== dayNumber),
        }));
    };

    const handleSave = () => {
        onUpdateSplit(localSplit);
        onClose();
    };

    const handleTitleChange = (newTitle: string) => {
        setLocalSplit(split => split ? { ...split, name: newTitle } : split);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setTitleModalVisible(true)}>
                        <Text style={styles.modalTitle} numberOfLines={1} ellipsizeMode="tail">
                            {localSplit.name}
                        </Text>
                    </TouchableOpacity>
                    <TitleChangeModal
                        visible={titleModalVisible}
                        initialTitle={localSplit.name}
                        onSave={(newTitle) => {
                            handleTitleChange(newTitle);
                            setTitleModalVisible(false);
                        }}
                        onCancel={() => setTitleModalVisible(false)}
                    />
                    <ScrollView style={styles.daysScroll} contentContainerStyle={{ paddingBottom: 8 }}>
                        {localSplit.routines.map((day) => (
                            <View key={day.day} style={styles.dayRow}>
                                <Text style={styles.dayLabel}>Day {day.day}</Text>
                                <TouchableOpacity
                                    style={styles.routineValue}
                                    onPress={() => handleDayPress(day.day)}
                                >
                                    <Text>{day.routine}</Text>
                                </TouchableOpacity>
                                {localSplit.routines.length > 1 && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveDay(day.day)}
                                    >
                                        <Text style={styles.removeButtonText}>×</Text>
                                    </TouchableOpacity>
                                )}
                                <RoutineSelectModal
                                    visible={expandedPicker === day.day}
                                    routines={availableRoutines}
                                    onSelect={(routine) => handleRoutineSelect(day.day, routine)}
                                    onClose={() => setExpandedPicker(null)}
                                />
                            </View>
                        ))}
                    </ScrollView>
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
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    routineModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routineModalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    routineModalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    routineOption: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    routineOptionText: {
        fontSize: 16,
        color: '#333',
    },
    daysScroll: {
        maxHeight: 350, // adjust as needed for your modal size
        marginBottom: 12,
    },
});