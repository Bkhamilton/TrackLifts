import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AddToWorkoutModal from '@/components/modals/Workout/AddToWorkoutModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import useHookActiveWorkout from '@/hooks/workout/useHookActiveWorkout';
import { useWorkoutActions } from '@/hooks/workout/useWorkoutActions';
import { useWorkoutTimer } from '@/hooks/workout/useWorkoutTimer';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ActiveWorkoutScreen() {
    const {
        addWorkoutModal,
        confirmModal,        
        openWorkoutModal,
        closeWorkoutModal,
        openConfirmModal,
        closeConfirmModal,
        handleConfirmSave,
    } = useHookActiveWorkout();
    const { 
        routine, 
        startTime,
        startTimeStr,
        setFinalTime, 
        setIsActiveWorkout, 
        resetRoutine, 
        setFinalWorkout,
    } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet, deleteSet, deleteExercise, replaceExerciseInRoutine } = useWorkoutActions();
    const { formattedTime, stopTimer } = useWorkoutTimer(startTime, false);
    const [completedSets, setCompletedSets] = useState<number[]>([]);

    const router = useRouter();

    const toggleSetComplete = (exerciseId: number, setId: number) => {
        setCompletedSets(prev => {
            if (prev.includes(setId)) {
                return prev.filter(id => id !== setId);
            } else {
                return [...prev, setId];
            }
        });
    };

    // Function to handle deleting a set
    const handleDeleteSet = (exerciseId: number, setId: number) => {
        deleteSet(exerciseId, setId);
        // Remove the set from completed sets if it was there
        setCompletedSets(prev => prev.filter(id => id !== setId));
    };

    // Calculate total sets and completed sets
    const totalSets = routine.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const allSetsCompleted = totalSets > 0 && completedSets.length === totalSets;

    // Function to handle stopping the workout
    const handleWorkoutAction = (isFinished: boolean) => {
        stopTimer();
        setIsActiveWorkout(false);
        if (isFinished) {
            const workout = {       
                routine: routine,
                startTime: startTimeStr,
                endTime: formattedTime,
                lengthMin: formattedTime,
                notes: '',
            };
            setFinalTime(formattedTime);
            setFinalWorkout(workout);
            router.replace('/finishWorkout')
        } else {
            // If any sets have been completed, prompt the user
            if (completedSets.length > 0) {
                openConfirmModal();
                return;
            }
            // Return the user to the newWorkout page without saving
            // Reset the routine to its initial state
            resetRoutine();
            router.replace('/(tabs)/workout/newWorkout');
        }
    };

    const handleDeleteExercise = (exerciseId: number) => {
        deleteExercise(exerciseId);
        // Remove all sets of the deleted exercise from completed sets
        setCompletedSets(prev => prev.filter(id => !routine.exercises.find(ex => ex.id === exerciseId)?.sets.some(set => set.id === id)));
    };
    
    return (
        <View style={styles.container}>
            <Title
                title={routine.title}
                leftContent={<Text>{formattedTime}</Text>}
                rightContent={
                    <TouchableOpacity 
                        onPress={allSetsCompleted ? () => handleWorkoutAction(true) : () => handleWorkoutAction(false)} 
                        style={[
                            styles.workoutActionButton,
                            allSetsCompleted ? styles.completeButton : styles.cancelButton
                        ]}
                    >
                        <Text 
                            style={
                                allSetsCompleted 
                                    ? styles.doneButtonText 
                                    : styles.cancelButtonText
                            }
                        >
                            {allSetsCompleted ? 'DONE' : 'CANCEL'}
                        </Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Workout
                    routine={routine}
                    open={openWorkoutModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet} // Add this prop
                    onToggleComplete={toggleSetComplete}
                    completedSets={completedSets}
                    onReplaceExercise={(exerciseId) => console.log(`Replace exercise ${exerciseId}`)}
                    onRemoveExercise={handleDeleteExercise}
                />
            </ScrollView>
            <AddToWorkoutModal
                visible={addWorkoutModal}
                close={closeWorkoutModal}
                add={addExercise}
            />            
            <ConfirmationModal
                visible={confirmModal}
                message="Are you sure you want to cancel this workout? Any completed sets will not be saved."
                onClose={closeConfirmModal}
                onSelect={(choice) => handleConfirmSave(choice)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1, // Allow the ScrollView to take up available space
        marginBottom: 83, // Add space for the button
        width: '100%', // Ensure the ScrollView takes the full width
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    workoutActionButton: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#ff8787',
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});