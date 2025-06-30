import EditableTitle from '@/components/EditableTitle';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AddToWorkoutModal from '@/components/modals/Workout/AddToWorkoutModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { HomeContext } from '@/contexts/HomeContext';
import { RoutineContext } from '@/contexts/RoutineContext';
import { useEditWorkoutActions } from '@/hooks/workout/useEditWorkoutActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function EditRoutineScreen() {
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const { updateRoutineInDB } = useContext(RoutineContext);
    const { routineToEdit } = useContext(HomeContext);
    const [editedRoutine, setEditedRoutine] = useState(routineToEdit);
    const { addExercise, updateSet, addSet, deleteSet, deleteExercise } = useEditWorkoutActions(editedRoutine, setEditedRoutine);

    const router = useRouter();

    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    // Function to handle deleting a set
    const handleDeleteSet = (exerciseId: number, setId: number) => {
        deleteSet(exerciseId, setId);
    };

    const handleSaveRoutine = () => {
        // If editedRoutine is different from routineToEdit, show confirmation modal
        if (JSON.stringify(editedRoutine) !== JSON.stringify(routineToEdit)) {
            setConfirmModal(true);
        } else {
            router.replace('/(tabs)/(index)')
        }
    }

    const handleConfirmSave = (option: 'yes' | 'no') => {
        if (option === 'yes') {
            // Save the changes to the routine
            // This is where you would typically update your context or state with the new routine
            // For example: updateRoutine(editedRoutine);
            updateRoutineInDB(editedRoutine);
            router.replace('/(tabs)/(index)');
        }
    }
    
    return (
        <View style={styles.container}>
            <EditableTitle
                title={editedRoutine.title}
                onTitleChange={(newTitle) => {
                    setEditedRoutine(prev => ({ ...prev, title: newTitle }));
                }}
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/(index)')
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
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}    
            >
                <Workout
                    routine={editedRoutine}
                    open={openModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet}
                    onReplaceExercise={(exerciseId) => console.log(`Replace exercise ${exerciseId}`)}
                    onRemoveExercise={(exerciseId) => deleteExercise(exerciseId)}
                />
            </ScrollView>
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