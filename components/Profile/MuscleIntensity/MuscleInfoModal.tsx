import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const MuscleInfoModal: React.FC<Props> = ({ visible, onClose, muscleData }) => {
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
                    
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
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
        width: '85%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
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
});

export default MuscleInfoModal;
