import NotesInput from '@/components/FinishWorkout/NotesInput';
import EditHistoryCard from '@/components/History/EditHistory/EditHistoryCard';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import { HistoryContext } from '@/contexts/HistoryContext';
import { useEditWorkoutActions } from '@/hooks/useEditWorkoutActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function EditHistoryScreen() {
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const { history, updateHistory } = useContext(HistoryContext);
    const [startTime, setStartTime] = useState(history.startTime);
    const [lengthMin, setLengthMin] = useState(history.lengthMin);
    const [editedNotes, setEditedNotes] = useState(history.notes);
    const [editedRoutine, setEditedRoutine] = useState(history.routine);
    const { addExercise, updateSet, addSet, deleteSet, deleteExercise } = useEditWorkoutActions(editedRoutine, setEditedRoutine);
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
        // If editedRoutine is different from history.routine, show confirmation modal
        if (JSON.stringify(editedRoutine) !== JSON.stringify(history.routine) || 
        editedNotes !== history.notes ||
        startTime !== history.startTime ||
        lengthMin !== history.lengthMin) {
            setConfirmModal(true);
        } else {
            router.replace('/(tabs)/history/main');
        }
    }

    const handleConfirmSave = (option: 'yes' | 'no') => {
        if (option === 'yes') {
            // Save the changes to the routine
            const updatedHistory = {
                ...history,
                routine: editedRoutine,
                notes: editedNotes,
                startTime,
                lengthMin,
            };
            updateHistory(updatedHistory);
            router.replace('/(tabs)/history/main');
        }
    }
    
    return (
        <View style={styles.container}>
            <Title
                title={editedRoutine.title}
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/history/main');
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
            <ScrollView style={styles.scrollView}>
                <EditHistoryCard
                    startTime={startTime}
                    lengthMin={lengthMin}
                    onChangeStartTime={setStartTime}
                    onChangeLengthMin={setLengthMin}
                />
                <NotesInput
                    value={editedNotes}
                    onChangeText={setEditedNotes}
                />
                <Workout
                    routine={editedRoutine}
                    open={openModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={handleDeleteSet} // Add this prop
                    onToggleComplete={toggleSetComplete}
                    completedSets={completedSets}
                    onReplaceExercise={(exerciseId) => console.log(`Replace exercise ${exerciseId}`)}
                    onRemoveExercise={(exerciseId) => {
                        deleteExercise(exerciseId);
                        // Remove all sets of the deleted exercise from completed sets
                        setCompletedSets(prev => prev.filter(id => !editedRoutine.exercises.find(ex => ex.id === exerciseId)?.sets.some(set => set.id === id)));
                    }}
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
                onSelect={(option) => handleConfirmSave(option)}
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