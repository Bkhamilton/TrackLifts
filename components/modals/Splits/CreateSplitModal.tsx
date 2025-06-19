import { Text, TextInput, View } from '@/components/Themed';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import RoutineSelectModal from '../RoutineSelectModal';

interface RoutineDay {
    day: number;
    routine: string;
}

interface CreateSplitModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (splitName: string, routines: RoutineDay[]) => void;
    availableRoutines: string[];
}

export default function CreateSplitModal({
    visible,
    onClose,
    onCreate,
    availableRoutines = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Rest'],
}: CreateSplitModalProps) {
    const [splitName, setSplitName] = useState('');
    const [days, setDays] = useState<RoutineDay[]>([{ day: 1, routine: 'Rest' }]);
    const [expandedPicker, setExpandedPicker] = useState<number | null>(null);

    const handleDayPress = (dayNumber: number) => {
        if (expandedPicker === dayNumber) {
            setExpandedPicker(null);
        } else {
            setExpandedPicker(dayNumber);
        }
    };

    const handleAddDay = () => {
        const newDayNumber = days.length > 0 ? Math.max(...days.map(d => d.day)) + 1 : 1;
        setDays([...days, { day: newDayNumber, routine: 'Rest' }]);
    };

    const handleRemoveDay = (dayNumber: number) => {
        if (days.length > 1) {
            setDays(days.filter(day => day.day !== dayNumber));
        }
    };

    const handleUpdateDay = (dayNumber: number, routine: string) => {
        setDays(days.map(day => 
            day.day === dayNumber ? { ...day, routine } : day
        ));
    };

    const handleCreate = () => {
        onCreate(splitName, days);
        setSplitName('');
        setDays([{ day: 1, routine: 'Rest' }]);
        setExpandedPicker(null);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Split</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Split Name"
                        value={splitName}
                        onChangeText={setSplitName}
                    />
                    
                    <Text style={styles.sectionLabel}>Configure Days:</Text>
                    
                    {days.map((day) => (
                        <View key={day.day} style={styles.dayRow}>
                            <Text style={styles.dayLabel}>Day {day.day}</Text>
                            
                            <TouchableOpacity 
                                style={styles.routineValue}
                                onPress={() => handleDayPress(day.day)}
                            >
                                <Text>{day.routine}</Text>
                            </TouchableOpacity>
                            
                            {days.length > 1 && (
                                <TouchableOpacity 
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveDay(day.day)}
                                >
                                    <Text style={styles.removeButtonText}>×</Text>
                                </TouchableOpacity>
                            )}
                            {/* RoutineSelectModal for this day */}
                            <RoutineSelectModal
                                visible={expandedPicker === day.day}
                                routines={availableRoutines}
                                onSelect={(routine) => {
                                    handleUpdateDay(day.day, routine);
                                    setExpandedPicker(null);
                                }}
                                onClose={() => setExpandedPicker(null)}
                            />
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
                        <TouchableOpacity 
                            style={[styles.createButton, !splitName && styles.disabledButton]}
                            onPress={handleCreate}
                            disabled={!splitName}
                        >
                            <Text style={styles.buttonText}>Create</Text>
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
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        color: '#555',
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
    createButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#ff8787',
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
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