import { ClearView, Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import React, { useContext, useState } from 'react';
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

    const { muscles } = useContext(DBContext);

    const selectedMuscles = muscles.filter(muscle => muscle.muscleGroup === selectedMuscleData?.name);

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

    const recoveryPercentage = Math.round((1 - selectedMuscleData.value) * 100);

    const getRecoveryStatus = (percentage: number) => {
        if (percentage >= 80) return 'Fully Recovered';
        if (percentage >= 60) return 'Ready for Training';
        if (percentage >= 40) return 'Limit Intensity';
        if (percentage >= 20) return 'Needs Recovery';
        return 'Requires Rest';
    };

    const getRecoveryColor = (percentage: number) => {
        if (percentage >= 80) return '#2ecc71'; // Green
        if (percentage >= 60) return '#f1c40f'; // Yellow
        if (percentage >= 40) return '#e67e22'; // Orange
        return '#e74c3c'; // Red
    };    

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
                <Text style={styles.sorenessTitle}>
                    {selectedMuscleData.name} Soreness
                </Text>                
                <ClearView style={styles.intensityBarContainer}>
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
                </ClearView>

                {/* Muscles Hit */}
                <ClearView style={styles.section}>
                    <Text style={styles.sectionTitle}>Muscles Hit</Text>
                    <ClearView style={styles.chipRow}>
                        {selectedMuscles.map((muscle, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{muscle.name}</Text>
                            </View>
                        ))}
                    </ClearView>
                </ClearView>

                {/* Exercises Done */}
                <ClearView style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercises Done</Text>
                    <ClearView style={styles.chipRow}>
                        {selectedMuscleData.exercises.map((exercise, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{exercise}</Text>
                            </View>
                        ))}
                    </ClearView>
                </ClearView>

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
        textAlign: 'right',
    },
    sorenessMeter: {
        marginBottom: 20,
    },
    sorenessTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    meterBackground: {
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    meterFill: {
        height: '100%',
    },
    meterLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    meterLabel: {
        fontSize: 14,
    },
    scoreContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 15,
        marginBottom: 15,
    },
    scoreItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    scoreLabel: {
        fontSize: 16,
        color: '#555',
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    recoveryStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },    
});

export default MuscleInfoPanel;