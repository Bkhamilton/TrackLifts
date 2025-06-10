import { ActiveExercise, History } from '@/utils/types'; // Adjust import path as needed
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import OptionsModal from './OptionsModal';

interface HistoryModalProps {
    visible: boolean;
    close: () => void;
    history: History;
}

export default function HistoryModal({ visible, close, history }: HistoryModalProps) {

    const router = useRouter();

    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const handleOptionSelect = (option: string) => {
        switch (option) {
            case 'edit':
                // Handle edit action here
                console.log('Edit workout');
                router.push('/(tabs)/history/editHistory')
                setOptionsModalVisible(false);
                close();
                break;
            case 'delete':
                // Handle delete action here
                console.log('Delete workout');
                setOptionsModalVisible(false);
                close();
                break;
            default:
                console.log('Unknown option selected');
                break;
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderExercise = ({ item }: { item: ActiveExercise }) => (
        <View style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{item.title}</Text>
                <Text style={styles.exerciseSubtitle}>
                    {item.muscleGroup} • {item.equipment}
                </Text>
            </View>
            
            <View style={styles.setsContainer}>
                {item.sets.map((set, index) => (
                    <View key={set.id} style={styles.setItem}>
                        <Text style={styles.setNumber}>Set {set.set_order}</Text>
                        <Text style={styles.setDetail}>{set.reps} reps × {set.weight} lbs</Text>
                        {set.restTime > 0 && (
                            <Text style={styles.restTime}>Rest: {set.restTime}s</Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
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
                        <Text style={styles.dateText}>{formatDate(history.date)}</Text>
                        
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#ff8787" />
                                <Text style={styles.statText}>{history.lengthMin} min</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="weight-pound" size={20} color="#ff8787" />
                                <Text style={styles.statText}>{history.totalWeight} lbs</Text>
                            </View>
                        </View>
                    </View>

                    {/* Exercises List */}
                    <FlatList
                        data={history.routine.exercises}
                        renderItem={renderExercise}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
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
        color: '#333',
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
        color: '#333',
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
        color: '#333',
        marginLeft: 6,
    },
    listContent: {
        paddingBottom: 16,
    },
    exerciseContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    exerciseHeader: {
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    exerciseSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    setsContainer: {
        marginTop: 8,
    },
    setItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        fontSize: 14,
        color: '#666',
    },
    setDetail: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    restTime: {
        fontSize: 13,
        color: '#ff8787',
    },
});