import { sorenessLabel } from '@/utils/sorenessModel';
import { ClearView, Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
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

type ExerciseBreakdown = {
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

const MuscleInfoPanel = ({
    selectedMuscleData,
    muscleData,
    selectedMuscle,
    setSelectedMuscle,
    getColor,
    view,
}: MuscleInfoPanelProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { muscleGroupSoreness } = useContext(DataContext);
    const group = muscleGroupSoreness.find(g => g.muscle_group === selectedMuscleData?.name);
    const muscleSoreness = [...(group?.muscles ?? [])].sort((a, b) => (b.value ?? -1) - (a.value ?? -1));
    const exerciseBreakdown = group ? { routine: 'All contributing workouts', date: 'Contributions to this soreness estimate', exercises: group.exercises } : null;

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
                                    width: `${(Number.isFinite(selectedMuscleData.value) ? Math.round(selectedMuscleData.value * 100) : 0)}%`,
                                    backgroundColor: getColor(selectedMuscleData.value),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.intensityBarLabel}>
                        {group?.value != null ? `${Math.round(group.value * 100)}` : '—'}
                    </Text>
                </ClearView>

                <Text style={{ fontSize: 12, marginBottom: 6 }}>
                    {sorenessLabel(group?.value)} · estimated /100.
                    {group?.status === 'no-recent-training' ? ' No recent logged training.' : ''}
                    {group?.confidence === 'limited' ? ' Limited information.' : ''}
                </Text>
                {group?.peak?.value > 0 && <Text style={{ fontSize: 12 }}>Highest: {group.peak.muscle_name} ({Math.round(group.peak.value * 100)}/100)</Text>}
                {group?.forecast48 != null && group.forecast48 > (group.value ?? 0) + .05 && <Text style={{ fontSize: 12 }}>May rise: next 48h estimate up to {Math.round(group.forecast48 * 100)}/100.</Text>}
                {group?.unsupported?.length > 0 && <Text style={{ fontSize: 12 }}>Unmapped: {group.unsupported.join(', ')}</Text>}
                {group?.reasons?.length > 0 && <Text style={{ fontSize: 11, marginVertical: 4 }}>{group.reasons.join('. ')}.</Text>}
                {/* Muscles Affected */}
                <ClearView style={styles.section}>
                    <Text style={styles.sectionTitle}>Muscles Affected</Text>
                    <ClearView style={styles.muscleContainer}>
                        {muscleSoreness.map((muscle, idx) => (
                            <ClearView key={idx} style={styles.muscleItem}>
                                <View style={[styles.muscleColorIndicator, { backgroundColor: getColor(muscle.value ?? NaN) }]} />
                                <Text style={styles.muscleName}>{muscle.muscle_name}: {muscle.value === null ? (muscle.status === 'unsupported' ? 'unmapped' : 'unavailable') : `${Math.round(muscle.value * 100)}/100`}</Text>
                            </ClearView>
                        ))}

                    </ClearView>
                </ClearView>

                {/* Exercises Done */}
                <ClearView style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercises Done</Text>
                    <ClearView style={styles.chipRow}>
                        {exerciseBreakdown && exerciseBreakdown.exercises && exerciseBreakdown.exercises.map((exercise: ExerciseBreakdown['exercises'][number], idx: number) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{exercise.name}</Text>
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
                breakdown={exerciseBreakdown ?? undefined} // Replace with actual breakdown data
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
    muscleContainer: {
        marginTop: 8,
    },
    muscleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    muscleColorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    muscleName: {
        flex: 1,
        fontSize: 14,
    },
    muscleScore: {
        fontWeight: 'bold',
        width: 40,
        textAlign: 'right',
    },    
});

export default MuscleInfoPanel;
