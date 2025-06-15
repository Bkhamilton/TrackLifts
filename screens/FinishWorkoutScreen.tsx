import CelebrationSection from '@/components/FinishWorkout/CelebrationSection';
import ExerciseBreakdownSection from '@/components/FinishWorkout/ExerciseBreakdownSection';
import SummaryStatsSection from '@/components/FinishWorkout/SummaryStatsSection';
import SaveRoutineModal from '@/components/modals/SaveRoutineModal';
import { ScrollView, Text, View } from '@/components/Themed';
import useHookFinishWorkout from '@/hooks/useHookFinishWorkout';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function FinishWorkoutScreen() {
    
    const router = useRouter();

    const {
        showSaveModal,
        handleSkipSaveRoutine,
        handleSaveRoutine,
        totalWorkoutsCompleted,
        finalTime,
        totalSets,
        totalWeightMoved,
        highestWeight,
        exerciseStats,
    } = useHookFinishWorkout();

    const handleDone = () => {
        router.replace('/(tabs)/(index)');
    };

    return (
        <View style={styles.container}>
            <SaveRoutineModal
                visible={showSaveModal}
                onClose={handleSkipSaveRoutine}
                onSave={handleSaveRoutine}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Celebration animation */}
                <CelebrationSection totalWorkoutsCompleted={totalWorkoutsCompleted} />

                {/* Summary stats */}
                <SummaryStatsSection
                    finalTime={finalTime || '00:00:00'}
                    totalSets={totalSets}
                    totalWeightMoved={totalWeightMoved}
                    highestWeight={highestWeight}
                />

                {/* Exercise breakdown */}
                <ExerciseBreakdownSection exerciseStats={exerciseStats} />
            </ScrollView>

            {/* Done button */}
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Awesome! Let's Celebrate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100, // Space for the button
    },
    doneButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});