import CelebrationSection from '@/components/FinishWorkout/CelebrationSection';
import ExerciseBreakdownSection from '@/components/FinishWorkout/ExerciseBreakdownSection';
import NotesInput from '@/components/FinishWorkout/NotesInput';
import SummaryStatsSection from '@/components/FinishWorkout/SummaryStatsSection';
import SaveRoutineModal from '@/components/modals/SaveRoutineModal';
import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import useHookFinishWorkout from '@/hooks/useHookFinishWorkout';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function FinishWorkoutScreen() {
    
    const router = useRouter();
    const { saveWorkoutToDatabase, clearRoutine } = useContext(ActiveWorkoutContext);

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

    const handleDone = async () => {
        // Build safeFinalWorkout with notes
        try {
            const safeFinalWorkout = {
                ...finalWorkout,
                notes: notes,
            };
            await saveWorkoutToDatabase(safeFinalWorkout);
            clearRoutine();
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