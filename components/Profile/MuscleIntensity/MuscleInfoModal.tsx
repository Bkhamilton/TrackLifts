import { ClearView, ScrollView, Text, View } from '@/components/Themed';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

type MuscleGroup = {
    id: string;
    name: string;
    value: number;
    description: string;
    exercises: string[];
};

type Props = {
    visible: boolean;
    onClose: () => void;
    muscleData: MuscleGroup;
    breakdown?: {
        routine: string;
        date: string;
        exercises: {
            name: string;
            sets: number;
            reps: number;
            weight: string;
            contribution: string;
        }[];
    };    
};

const getPrimaryMuscles = (muscleGroupId: string): string[] => {
    const muscles: Record<string, string[]> = {
        chest: ['Pectoralis Major', 'Pectoralis Minor', 'Serratus Anterior'],
        back: ['Latissimus Dorsi', 'Trapezius', 'Rhomboids', 'Erector Spinae'],
        arms: ['Biceps Brachii', 'Triceps Brachii', 'Brachialis', 'Forearm Muscles'],
        shoulders: ['Anterior Deltoid', 'Lateral Deltoid', 'Posterior Deltoid', 'Rotator Cuff'],
        core: ['Rectus Abdominis', 'Obliques', 'Transverse Abdominis', 'Erector Spinae'],
        legs: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Hip Flexors']
    };
    return muscles[muscleGroupId] || [];
};

const MuscleInfoModal: React.FC<Props> = ({ visible, onClose, muscleData, breakdown }) => {
    if (!muscleData) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.modalTitle}>
                            {muscleData.name} Details
                        </Text>
                        
                        <Text style={styles.modalDescription}>
                            {muscleData.description}
                        </Text>
                        
                        <Text style={styles.modalSectionTitle}>
                            Primary Muscles Worked:
                        </Text>
                        <View style={styles.modalMusclesList}>
                            {getPrimaryMuscles(muscleData.id).map((muscle, index) => (
                                <Text key={index} style={styles.modalMuscleItem}>
                                    • {muscle}
                                </Text>
                            ))}
                        </View>
                        
                        <Text style={styles.modalSectionTitle}>
                            Recommended Exercises:
                        </Text>
                        <View style={styles.modalExercisesContainer}>
                            {muscleData.exercises.map((exercise, index) => (
                                <View key={index} style={styles.modalExercisePill}>
                                    <Text style={styles.modalExerciseText}>{exercise}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Intensity Breakdown Section */}
                        {breakdown && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.modalSectionTitle}>Intensity Breakdown</Text>
                                <Text style={{ fontSize: 15, color: '#555', marginBottom: 4 }}>
                                    Routine: <Text style={{ fontWeight: 'bold' }}>{breakdown.routine}</Text>
                                </Text>
                                <Text style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
                                    Date: {breakdown.date}
                                </Text>
                                <View style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', paddingVertical: 6 }}>
                                        <Text style={[styles.tableHeader, { flex: 2 }]}>Exercise</Text>
                                        <Text style={styles.tableHeader}>Sets</Text>
                                        <Text style={styles.tableHeader}>Reps</Text>
                                        <Text style={styles.tableHeader}>Weight</Text>
                                        <Text style={styles.tableHeader}>%</Text>
                                    </View>
                                    {breakdown.exercises.map((ex, idx) => (
                                        <View key={idx} style={{ flexDirection: 'row', paddingVertical: 5, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{ex.name}</Text>
                                            <Text style={styles.tableCell}>{ex.sets}</Text>
                                            <Text style={styles.tableCell}>{ex.reps}</Text>
                                            <Text style={styles.tableCell}>{ex.weight}</Text>
                                            <Text style={styles.tableCell}>{ex.contribution}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>

                        <ClearView style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a86e8',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalMusclesList: {
        marginBottom: 20,
    },
    modalMuscleItem: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    modalExercisesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    modalExercisePill: {
        backgroundColor: '#e3f2fd',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        margin: 5,
    },
    modalExerciseText: {
        fontSize: 15,
        color: '#1976d2',
    },
    closeButton: {
        backgroundColor: '#4a86e8',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1976d2',
        flex: 1,
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 13,
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
});

export default MuscleInfoModal;
