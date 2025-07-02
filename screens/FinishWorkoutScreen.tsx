import CelebrationSection from '@/components/FinishWorkout/CelebrationSection';
import ExerciseBreakdownSection from '@/components/FinishWorkout/ExerciseBreakdownSection';
import NotesInput from '@/components/FinishWorkout/NotesInput';
import SummaryStatsSection from '@/components/FinishWorkout/SummaryStatsSection';
import RoutineMismatchModal from '@/components/modals/FinishWorkout/RoutineMismatchModal';
import SaveRoutineModal from '@/components/modals/FinishWorkout/SaveRoutineModal';
import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import useHookFinishWorkout from '@/hooks/useHookFinishWorkout';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function FinishWorkoutScreen() {
    
    const router = useRouter();
    const { clearRoutine } = useContext(ActiveWorkoutContext);
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
        finalWorkout,
        notes,
        setNotes,
        completedRoutine,
        showRoutineMismatchModal,
        setShowRoutineMismatchModal,
        routineOptions,
        expectedRoutine,
        selectedRoutineId,
        setSelectedRoutineId,        
        handleRoutineSelection,
        handleDone,        
    } = useHookFinishWorkout();

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
        backgroundColor: '#ff8787',
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