import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MuscleInfoModal from './MuscleInfoModal';

type MuscleGroup = {
    id: string;
    name: string;
    value: number;
    description: string;
    exercises: string[];
};

const MuscleInfoPanel = ({
    selectedMuscleData,
}: {
    selectedMuscleData: MuscleGroup | null;
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    if (!selectedMuscleData) {
        return (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    Select a muscle group to see detailed information
                </Text>
            </View>
        );
    }

    const truncatedExercises = selectedMuscleData.exercises.slice(0, 4); // Show max 4 exercises

    return (
        <>
            <TouchableOpacity 
                style={styles.infoCard}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.infoTitle}>{selectedMuscleData.name}</Text>
                <Text style={styles.infoValue}>
                    Intensity: <Text style={styles.highlightValue}>
                        {Math.round(selectedMuscleData.value * 100)}%
                    </Text>
                </Text>
                
                <View style={styles.descriptionContainer}>
                    <Text 
                        style={styles.infoDescription}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {selectedMuscleData.description}
                    </Text>
                </View>
                
                <Text style={styles.sectionTitle}>Targeted Exercises:</Text>
                <View style={styles.exercisesContainer}>
                    {truncatedExercises.map((exercise, index) => (
                        <View key={index} style={styles.exercisePill}>
                            <Text style={styles.exerciseText}>{exercise}</Text>
                        </View>
                    ))}
                    {selectedMuscleData.exercises.length > 4 && (
                        <Text style={styles.moreText}>+{selectedMuscleData.exercises.length - 4} more</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* Detailed Info Modal */}
            <MuscleInfoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                muscleData={selectedMuscleData}
            />
        </>
    );
};

const styles = StyleSheet.create({
    infoCard: {
        flex: 1,
        padding: 4,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    infoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4a86e8',
    },
    infoValue: {
        fontSize: 18,
        marginBottom: 15,
        color: '#333',
    },
    highlightValue: {
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    descriptionContainer: {
        height: 70, // Fixed height for description
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    infoDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    exercisesContainer: {
        height: 90, // Fixed height for exercises
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    exercisePill: {
        backgroundColor: '#e3f2fd',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
    },
    exerciseText: {
        fontSize: 14,
        color: '#1976d2',
    },
    moreText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 8,
        alignSelf: 'center',
    },
});

export default MuscleInfoPanel;