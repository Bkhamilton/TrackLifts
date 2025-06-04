import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useWorkoutActions } from '@/hooks/useWorkoutActions';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ActiveWorkoutScreen() {
    const [modal, setModal] = useState(false);
    const { routine, startTime, setIsActiveWorkout, resetRoutine, saveWorkoutToDatabase } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet, deleteSet } = useWorkoutActions();
    const { formattedTime, stopTimer } = useWorkoutTimer(startTime, false);
    const [completedSets, setCompletedSets] = useState<number[]>([]);

    const router = useRouter();

    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

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
        console.log(`Deleting set ${setId} from exercise ${exerciseId}`);
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
            // Save the workout to the database and update the current routine to match the completed workou  
            // build Workout object using routine
            const workout = {       
                routine: routine,
                startTime: startTime,
                endTime: Date.now(),
                lengthMin: formattedTime,
                notes: 'Workout completed successfully!' // Add any notes if needed
            };
            saveWorkoutToDatabase(workout);
            // Display a success modal and navigate to the home page
            // openSuccessModal(routine, 'Workout completed successfully!');
            router.replace('/finishWorkout')
        } else {
            // Return the user to the newWorkout page without saving
            // Reset the routine to its initial state
            resetRoutine();
            router.replace('/(tabs)/workout/newWorkout');
        }
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
            <AddToWorkoutModal
                visible={modal}
                close={closeModal}
                add={addExercise}
            />
            <ScrollView style={styles.scrollView}>
                <Workout
                    routine={routine}
                    open={openModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet} // Add this prop
                    onToggleComplete={toggleSetComplete}
                    completedSets={completedSets}
                />
            </ScrollView>
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