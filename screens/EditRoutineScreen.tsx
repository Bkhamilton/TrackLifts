import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { HomeContext } from '@/contexts/HomeContext';
import { useEditWorkoutActions } from '@/hooks/useEditWorkoutActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function EditRoutineScreen() {
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const { routineToEdit } = useContext(HomeContext);
    const [editedRoutine, setEditedRoutine] = useState(routineToEdit);
    const { addExercise, updateSet, addSet, deleteSet } = useEditWorkoutActions(editedRoutine, setEditedRoutine);
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
        deleteSet(exerciseId, setId);
        // Remove the set from completed sets if it was there
        setCompletedSets(prev => prev.filter(id => id !== setId));
    };

    const handleSaveRoutine = () => {
        // If editedRoutine is different from routineToEdit, show confirmation modal
        if (JSON.stringify(editedRoutine) !== JSON.stringify(routineToEdit)) {
            setConfirmModal(true);
        } else {
            router.back();
        }
    }

    const handleConfirmSave = (option: 'yes' | 'no') => {
        if (option === 'yes') {
            // Save the changes to the routine
            // This is where you would typically update your context or state with the new routine
            // For example: updateRoutine(editedRoutine);
            router.back();
        } else {
            // Discard changes and go back
            router.back();
        }
    }
    
    return (
        <View style={styles.container}>
            <Title
                title={editedRoutine.title}
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.back();
                        }}
                        style={{ marginRight: 12 }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                }
                rightContent={
                    <TouchableOpacity 
                        onPress={() => handleSaveRoutine()} 
                        style={styles.workoutActionButton}
                    >
                        <Text 
                            style={styles.doneButtonText}
                        >
                            SAVE
                        </Text>
                    </TouchableOpacity>
                }
            />
            <AddToWorkoutModal
                visible={modal}
                close={closeModal}
                add={addExercise}
            />
            <ConfirmationModal
                visible={confirmModal}
                message="Confirm changes?"
                onClose={() => setConfirmModal(false)}
                onSelect={(choice) => handleConfirmSave(choice)}
            />
            <ScrollView style={styles.scrollView}>
                <Workout
                    routine={editedRoutine}
                    open={openModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet} // Add this prop
                    onToggleComplete={toggleSetComplete}
                    completedSets={completedSets}
                    onReplaceExercise={(exerciseId) => console.log(`Replace exercise ${exerciseId}`)}
                    onRemoveExercise={(exerciseId) => console.log(`Remove exercise ${exerciseId}`)}
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