import { ScrollView, Text, TextInput, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface RoutineDay {
    day: number;
    routine: string;
    routine_id?: number;
}

interface Split {
    id: number;
    name: string;
    routines: RoutineDay[];
    isPrimary?: boolean;
}

// Sample data - replace with your actual data source
const sampleSplits: Split[] = [
    {
        id: 1,
        name: 'Weekly Cycle',
        isPrimary: true,
        routines: [
            { day: 1, routine: 'Push' },
            { day: 2, routine: 'Pull' },
            { day: 3, routine: 'Legs' },
            { day: 4, routine: 'Rest' },
            { day: 5, routine: 'Push' },
            { day: 6, routine: 'Pull' },
            { day: 7, routine: 'Legs' }
        ]
    },
    {
        id: 2,
        name: 'Upper/Lower',
        routines: [
            { day: 1, routine: 'Upper' },
            { day: 2, routine: 'Lower' },
            { day: 3, routine: 'Rest' },
            { day: 4, routine: 'Upper' },
            { day: 5, routine: 'Lower' },
            { day: 6, routine: 'Rest' },
            { day: 7, routine: 'Rest' }
        ]
    }
];

const availableRoutines = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Rest'];

export default function SplitScreen() {
    const [splits, setSplits] = useState<Split[]>(sampleSplits);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSplitName, setNewSplitName] = useState('');
    const [editingSplit, setEditingSplit] = useState<Split | null>(null);
    const [currentWeek, setCurrentWeek] = useState<RoutineDay[]>(sampleSplits[0].routines);

    const setAsPrimary = (id: number) => {
        setSplits(prev => prev.map(split => ({
            ...split,
            isPrimary: split.id === id
        })));
        const primarySplit = splits.find(s => s.id === id);
        if (primarySplit) {
            setCurrentWeek(primarySplit.routines);
        }
    };

    const createNewSplit = () => {
        const newSplit: Split = {
            id: splits.length + 1,
            name: newSplitName,
            routines: Array(7).fill(null).map((_, i) => ({
                day: i + 1,
                routine: 'Rest' // Default to rest days
            }))
        };
        setSplits([...splits, newSplit]);
        setNewSplitName('');
        setShowCreateModal(false);
    };

    const updateSplitDay = (splitId: number, day: number, routine: string) => {
        setSplits(prev => prev.map(split => {
            if (split.id === splitId) {
                return {
                    ...split,
                    routines: split.routines.map(d => 
                        d.day === day ? { ...d, routine } : d
                    )
                };
            }
            return split;
        }));
    };

    return (
        <View style={styles.container}>
            {/* Current Week Display */}
            <View style={styles.currentWeekContainer}>
                <Text style={styles.sectionTitle}>CURRENT SPLIT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {currentWeek.map((day, index) => (
                        <View key={index} style={[
                            styles.dayPill,
                            day.routine === 'Rest' && styles.restDayPill
                        ]}>
                            <Text style={styles.dayText}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                            </Text>
                            <Text style={[
                                styles.routineText,
                                day.routine === 'Rest' && styles.restDayText
                            ]}>
                                {day.routine}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Your Splits Section */}
            <View style={styles.splitsContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>YOUR SPLITS</Text>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => setShowCreateModal(true)}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color="#ff8787" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={splits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.splitCard,
                            item.isPrimary && styles.primarySplitCard
                        ]}>
                            <View style={styles.splitHeader}>
                                <Text style={styles.splitName}>{item.name}</Text>
                                <View style={styles.splitActions}>
                                    {!item.isPrimary && (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => setAsPrimary(item.id)}
                                        >
                                            <Text style={styles.actionText}>Set as Primary</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => setEditingSplit(item)}
                                    >
                                        <MaterialCommunityIcons name="pencil" size={18} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={styles.splitDays}>
                                {item.routines.map((day, index) => (
                                    <View key={index} style={styles.splitDayItem}>
                                        <Text style={styles.dayLabel}>
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.day - 1]}
                                        </Text>
                                        <Text style={styles.routineLabel}>
                                            {day.routine}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Create New Split Modal */}
            <Modal
                visible={showCreateModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Split</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Split Name"
                            value={newSplitName}
                            onChangeText={setNewSplitName}
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowCreateModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={createNewSplit}
                                disabled={!newSplitName}
                            >
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Split Modal */}
            {editingSplit && (
                <Modal
                    visible={!!editingSplit}
                    transparent={true}
                    animationType="slide"
                >
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
                                        onValueChange={(value) => updateSplitDay(editingSplit.id, day.day, value)}
                                    >
                                        {availableRoutines.map((routine, i) => (
                                            <Picker.Item key={i} label={routine} value={routine} />
                                        ))}
                                    </Picker>
                                </View>
                            ))}
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setEditingSplit(null)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => setEditingSplit(null)}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    currentWeekContainer: {
        marginBottom: 24,
    },
    splitsContainer: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addButton: {
        padding: 4,
    },
    dayPill: {
        width: 80,
        padding: 8,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    restDayPill: {
        backgroundColor: 'rgba(240, 240, 240, 0.6)',
    },
    dayText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
    routineText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    restDayText: {
        color: 'rgba(85, 85, 85, 0.6)',
    },
    splitCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    primarySplitCard: {
        borderWidth: 1,
        borderColor: '#ff8787',
    },
    splitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    splitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    splitActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 12,
    },
    actionText: {
        color: '#ff8787',
        fontSize: 12,
    },
    splitDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    splitDayItem: {
        width: '14%',
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#666',
    },
    routineLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
    createButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#ff8787',
        borderRadius: 8,
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