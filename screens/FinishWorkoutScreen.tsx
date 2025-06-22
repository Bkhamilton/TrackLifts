import CelebrationSection from '@/components/FinishWorkout/CelebrationSection';
import ExerciseBreakdownSection from '@/components/FinishWorkout/ExerciseBreakdownSection';
import NotesInput from '@/components/FinishWorkout/NotesInput';
import SummaryStatsSection from '@/components/FinishWorkout/SummaryStatsSection';
import RoutineMismatchModal from '@/components/modals/RoutineMismatchModal';
import SaveRoutineModal from '@/components/modals/SaveRoutineModal';
import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { SplitContext } from '@/contexts/SplitContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import useHookFinishWorkout from '@/hooks/useHookFinishWorkout';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function FinishWorkoutScreen() {
    
    const router = useRouter();
    const { saveWorkoutToDatabase, clearRoutine } = useContext(ActiveWorkoutContext);
    const { refreshHistory } = useContext(WorkoutContext);

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
        routine,
        finalWorkout,
    } = useHookFinishWorkout();

    const [notes, setNotes] = React.useState(finalWorkout?.notes || '');

    const { activeSplit, getCurrentSplitDay, completeCurrentSplitDay } = useContext(SplitContext);
    const { routine: completedRoutine } = useContext(ActiveWorkoutContext);

    const [showRoutineMismatchModal, setShowRoutineMismatchModal] = useState(false);
    const [routineOptions, setRoutineOptions] = useState<any[]>([]);
    const [expectedRoutine, setExpectedRoutine] = useState<any>(null);
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);

    // This function checks and handles split completion logic
    const handleSplitCompletion = async () => {
        if (!activeSplit) return;
        const dayIndex = await getCurrentSplitDay();
        const routinesSorted = [...activeSplit.routines].sort((a, b) => a.day - b.day);
        const expected = routinesSorted[dayIndex];
        setExpectedRoutine(expected);

        // If the completed routine matches the expected routine, just complete the day
        if (completedRoutine.id === expected.routine_id) {
            await completeCurrentSplitDay();
            return true; // No modal needed
        } else {
            // Show modal to ask user which routine it most resembles
            setRoutineOptions(routinesSorted);
            setShowRoutineMismatchModal(true);
            return false; // Modal will handle completion
        }
    };

    // Call this after user selects a routine in the modal
    const handleRoutineSelection = async () => {
        // You can store the user's selection in a log if you want for analytics
        // For now, just complete the split day
        await completeCurrentSplitDay();
        setShowRoutineMismatchModal(false);
    };

    const handleDone = async () => {
        // Build safeFinalWorkout with notes
        try {
            const safeFinalWorkout = {
                ...finalWorkout,
                notes: notes,
            };
            await saveWorkoutToDatabase(safeFinalWorkout);
            // Handle split completion logic
            const completedNormally = await handleSplitCompletion();
            if (completedNormally) {
                refreshHistory();
                clearRoutine();
                router.replace('/(tabs)/(index)');
            }
            // If the split completion logic required user input, it will handle that in the modal
        } catch (error) {
            console.error('Error saving workout:', error);
        }
        router.replace('/(tabs)/(index)');
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Celebration animation */}
                <CelebrationSection 
                    totalWorkoutsCompleted={totalWorkoutsCompleted} 
                />

                {/* Summary stats */}
                <SummaryStatsSection
                    finalTime={finalTime || '00:00:00'}
                    totalSets={totalSets}
                    totalWeightMoved={totalWeightMoved}
                    highestWeight={highestWeight}
                />

                {/* Exercise breakdown */}
                <ExerciseBreakdownSection 
                    exerciseStats={exerciseStats} 
                />

                {/* Notes input */}
                <NotesInput 
                    value={notes} 
                    onChangeText={setNotes} 
                />
            </ScrollView>

            {/* Done button */}
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Awesome! Let's Celebrate</Text>
            </TouchableOpacity>

            <SaveRoutineModal
                visible={showSaveModal}
                onClose={handleSkipSaveRoutine}
                onSave={handleSaveRoutine}
            />

            <RoutineMismatchModal
                visible={showRoutineMismatchModal}
                completedRoutineTitle={completedRoutine.title}
                expectedRoutineName={expectedRoutine?.routine_name || expectedRoutine?.routine || 'Unknown'}
                routineOptions={routineOptions}
                selectedRoutineId={selectedRoutineId}
                setSelectedRoutineId={setSelectedRoutineId}
                onContinue={async () => {
                    await handleRoutineSelection();
                    refreshHistory();
                    clearRoutine();
                    router.replace('/(tabs)/(index)');
                }}
                onClose={() => setShowRoutineMismatchModal(false)}
            />
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