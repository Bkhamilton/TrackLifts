import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AddExerciseModal from '@/components/modals/Workout/AddExerciseModal';
import { Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import useHookActiveWorkout from '@/hooks/workout/useHookActiveWorkout';
import { useWorkoutActions } from '@/hooks/workout/useWorkoutActions';
import { useWorkoutTimer } from '@/hooks/workout/useWorkoutTimer';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function ActiveWorkoutScreen() {
    const {
        addWorkoutModal,
        replaceWorkoutModal,
        confirmModal,
        openWorkoutModal,
        closeWorkoutModal,
        openReplaceWorkoutModal,
        closeReplaceWorkoutModal,
        openConfirmModal,
        closeConfirmModal,
        handleConfirmSave
    } = useHookActiveWorkout();
    const { 
        routine,
        updateRoutine,
        startTime,
        startTimeStr,
        setFinalTime, 
        setIsActiveWorkout, 
        resetRoutine, 
        setFinalWorkout,
    } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet, deleteSet, deleteExercise, replaceExerciseInRoutine } = useWorkoutActions();
    const { formattedTime, stopTimer } = useWorkoutTimer(startTime, false);
    const router = useRouter();
    const completedCount = routine.exercises.reduce((n, ex) => n + ex.sets.filter(s => s.completed).length, 0);
    const canFinish = completedCount > 0;
    const toggleSetComplete = (exerciseIndex: number, setId: number) => {
        updateRoutine({ ...routine, exercises: routine.exercises.map((ex, i) => i !== exerciseIndex ? ex : {
            ...ex, sets: ex.sets.map(set => set.id !== setId ? set : { ...set, completed: !set.completed })
        }) });
    };
    const handleDeleteSet = deleteSet;

    const background = useThemeColor({}, 'background');

    // Function to handle stopping the workout
    const handleWorkoutAction = (isFinished: boolean) => {
        stopTimer();
        setIsActiveWorkout(false);
        if (isFinished) {
            const workout = {       
                routine: routine,
                startTime: startTimeStr,
                endTime: new Date().toISOString(),
                lengthMin: formattedTime,
                notes: '',
            };
            setFinalTime(formattedTime);
            setFinalWorkout(workout);
            router.replace('/finishWorkout')
        } else {
            // If any sets have been completed, prompt the user
            if (completedCount > 0) {
                openConfirmModal();
                return;
            }
            // Return the user to the newWorkout page without saving
            // Reset the routine to its initial state
            resetRoutine();
            router.replace('/(tabs)/workout/newWorkout');
        }
    };

    const handleDeleteExercise = deleteExercise;

    const [exerciseIndexToReplace, setExerciseIndexToReplace] = useState<number | null>(null);
    
    return (
        <View 
            style={[styles.container, { backgroundColor: background }]}
        >
            <Title
                title={routine.title}
                leftContent={<Text>{formattedTime}</Text>}
                rightContent={
                    <TouchableOpacity 
                        onPress={canFinish ? () => handleWorkoutAction(true) : () => handleWorkoutAction(false)}
                        style={[
                            styles.workoutActionButton,
                            canFinish ? styles.completeButton : styles.cancelButton
                        ]}
                    >
                        <Text 
                            style={
                                canFinish
                                    ? styles.doneButtonText 
                                    : styles.cancelButtonText
                            }
                        >
                            {canFinish ? 'DONE' : 'CANCEL'}
                        </Text>
                    </TouchableOpacity>
                }
            />
            <KeyboardAwareScrollView
                style={styles.scrollView}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                bottomOffset={40} // Adjust as needed to ensure input is visible above keyboard
                keyboardShouldPersistTaps="handled"
            >
                <Workout
                    routine={routine}
                    open={openWorkoutModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet}
                    onToggleComplete={toggleSetComplete}
                    onReplaceExercise={(exerciseIndex) => {
                        setExerciseIndexToReplace(exerciseIndex);
                        openReplaceWorkoutModal();
                    }}
                    onRemoveExercise={handleDeleteExercise}
                />
            </KeyboardAwareScrollView>
            <AddExerciseModal
                visible={replaceWorkoutModal}
                close={closeReplaceWorkoutModal}
                mode="replace"
                onSelect={(newExercise) => {
                    if (exerciseIndexToReplace !== null) {
                        replaceExerciseInRoutine(exerciseIndexToReplace, newExercise);
                        setExerciseIndexToReplace(null);
                    }
                    closeReplaceWorkoutModal();
                }}
            />
            <AddExerciseModal
                visible={addWorkoutModal}
                close={closeWorkoutModal}
                mode="add"
                onSelect={addExercise}
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
        backgroundColor: 'transparent',
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