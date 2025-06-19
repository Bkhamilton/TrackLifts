import { ClearView, Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MuscleInfoModal from './MuscleInfoModal';
import MuscleLabels from './MuscleLabels';

type MuscleGroup = {
    id: string;
    name: string;
    value: number;
    description: string;
    exercises: string[];
};

type MuscleInfoPanelProps = {
    selectedMuscleData: MuscleGroup | null;
    muscleData: MuscleGroup[];
    selectedMuscle: string | null;
    setSelectedMuscle: (id: string | null) => void;
    getColor: (intensity: number) => string;
    view: 'front' | 'back';
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

const MuscleInfoPanel = ({
    selectedMuscleData,
    muscleData,
    selectedMuscle,
    setSelectedMuscle,
    getColor,
    view,
}: MuscleInfoPanelProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    if (!selectedMuscleData) {
        return (
            <View style={styles.placeholder}>
                <ClearView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.placeholderText}>
                        Select a muscle group to see detailed information
                    </Text>
                </ClearView>
                {/* Show muscle labels even if nothing is selected */}
                <MuscleLabels
                    muscleData={muscleData}
                    selectedMuscle={selectedMuscle}
                    setSelectedMuscle={setSelectedMuscle}
                    getColor={getColor}
                    view={view}
                />
            </View>
        );
    }

    const hardcodedBreakdown = {
        routine: "Push Day A",
        date: "2025-06-18",
        exercises: [
            {
                name: "Bench Press",
                sets: 4,
                reps: 8,
                weight: "185 lbs",
                contribution: "40%"
            },
            {
                name: "Incline Dumbbell Press",
                sets: 3,
                reps: 10,
                weight: "55 lbs",
                contribution: "25%"
            },
            {
                name: "Push-ups",
                sets: 3,
                reps: 20,
                weight: "Bodyweight",
                contribution: "20%"
            },
            {
                name: "Chest Fly",
                sets: 2,
                reps: 15,
                weight: "25 lbs",
                contribution: "15%"
            }
        ]
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {/* Info Card (clickable for modal) */}
            <TouchableOpacity 
                style={styles.infoCard}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                {/* Intensity Bar */}
                <View style={styles.intensityBarContainer}>
                    <View style={styles.intensityBarBackground}>
                        <View
                            style={[
                                styles.intensityBarFill,
                                {
                                    width: `${Math.round(selectedMuscleData.value * 100)}%`,
                                    backgroundColor: getColor(selectedMuscleData.value),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.intensityBarLabel}>
                        {Math.round(selectedMuscleData.value * 100)}%
                    </Text>
                </View>
                
                {/* Muscles Hit */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Muscles Hit</Text>
                    <View style={styles.chipRow}>
                        {getPrimaryMuscles(selectedMuscleData.id).map((muscle, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{muscle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Exercises Done */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercises Done</Text>
                    <View style={styles.chipRow}>
                        {selectedMuscleData.exercises.map((exercise, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{exercise}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </TouchableOpacity>

            {/* Muscle Labels (buttons) */}
            <MuscleLabels
                muscleData={muscleData}
                selectedMuscle={selectedMuscle}
                setSelectedMuscle={setSelectedMuscle}
                getColor={getColor}
                view={view}
            />

            {/* Detailed Info Modal */}
            <MuscleInfoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                muscleData={selectedMuscleData}
                breakdown={hardcodedBreakdown} // Replace with actual breakdown data
            />
        </View>
    );
};

const styles = StyleSheet.create({
    infoCard: {
        flex: 1,
        padding: 4,
        marginBottom: 8,
        backgroundColor: 'transparent',
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
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 22,
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
        height: 70,
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    infoDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    exercisesContainer: {
        height: 90,
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
        section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 2,
    },
    chip: {
        backgroundColor: '#e3f2fd',
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginRight: 6,
        marginBottom: 4,
    },
    chipText: {
        fontSize: 13,
        color: '#1976d2',
    },
    intensityBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    intensityBarBackground: {
        flex: 1,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 10,
    },
    intensityBarFill: {
        height: '100%',
        borderRadius: 8,
    },
    intensityBarLabel: {
        width: 40,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
});

export default MuscleInfoPanel;