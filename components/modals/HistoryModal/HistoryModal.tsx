import { History } from '@/constants/types'; // Adjust import path as needed
import { HistoryContext } from '@/contexts/HistoryContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { calculateTotalWeight } from '@/utils/workoutCalculations';
import { formatLengthTime, formatShortDate } from '@/utils/workoutUtils';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../Themed';
import ConfirmationModal from '../ConfirmationModal';
import OptionsModal from '../OptionsModal';
import ExerciseCard from './ExerciseCard';

interface HistoryModalProps {
    visible: boolean;
    close: () => void;
    history: History;
}

export default function HistoryModal({ visible, close, history }: HistoryModalProps) {

    const router = useRouter();
    const { setHistory } = useContext(HistoryContext);
    const { deleteWorkout } = useContext(WorkoutContext);

    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

    const handleOptionSelect = (option: string) => {
        switch (option) {
            case 'edit':
                // Handle edit action here
                console.log('Edit workout');
                setOptionsModalVisible(false);
                setHistory(history);
                close();
                router.replace('/(tabs)/history/editHistory')
                break;
            case 'delete':
                // Handle delete action here
                console.log('Delete workout');
                setOptionsModalVisible(false);
                setConfirmationModalVisible(true);
                break;
            default:
                console.log('Unknown option selected');
                break;
        }
    }

    const totalWeight = calculateTotalWeight(history);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Workout Details</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity 
                                onPress={() => setOptionsModalVisible(true)} 
                                style={[styles.closeButton, { marginRight: 8 }]}
                            >
                                <SimpleLineIcons name="options" size={24} color="#ff8787" />
                            </TouchableOpacity>                            
                            <TouchableOpacity 
                                onPress={close} 
                                style={styles.closeButton}
                            >
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Summary */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.routineTitle}>{history.routine.title}</Text>
                        <Text style={styles.dateText}>{formatShortDate(history.startTime)}</Text>
                        
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#ff8787" />
                                <Text style={styles.statText}>{formatLengthTime(history.endTime)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="weight-pound" size={20} color="#ff8787" />
                                <Text style={styles.statText}>{totalWeight} lbs</Text>
                            </View>
                        </View>
                        {
                            history.notes && 
                            <View style={styles.notesContainer}>
                                <Text style={styles.notesText}>{history.notes}</Text>
                            </View>
                        }
                    </View>

                    {/* Exercises List */}
                    <FlatList
                        data={history.routine.exercises}
                        renderItem={({ item }) => (
                            <ExerciseCard exercise={item} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
            <OptionsModal
                visible={optionsModalVisible}
                close={() => setOptionsModalVisible(false)}
                title="Options"
                options={[
                    { label: 'Edit Workout', value: 'edit' },
                    { label: 'Delete Workout', value: 'delete', destructive: true }
                ]}
                onSelect={handleOptionSelect}
            />    
            <ConfirmationModal
                visible={confirmationModalVisible}
                onClose={() => setConfirmationModalVisible(false)}
                message="Are you sure you want to delete this workout? This action cannot be undone."
                onSelect={async (choice) => {
                    // Handle deletion logic here
                    if (choice === 'yes') {
                        console.log('Workout deleted');
                        // Add your deletion logic here
                        await deleteWorkout(history);
                        close();
                    }
                    setConfirmationModalVisible(false);
                }}
            />        
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    summaryContainer: {
        marginBottom: 16,
    },
    routineTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        fontSize: 14,
        marginLeft: 6,
    },
    listContent: {
        paddingBottom: 16,
    },
    notesContainer: {
        marginTop: 4,
    },
    notesText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
});