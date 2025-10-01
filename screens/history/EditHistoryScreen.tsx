import NotesInput from '@/components/FinishWorkout/NotesInput';
import EditHistoryCard from '@/components/History/EditHistory/EditHistoryCard';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AddExerciseModal from '@/components/modals/Workout/AddExerciseModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/ActiveWorkout/Workout';
import useHookEditHistory from '@/hooks/history/useHookEditHistory';
import { useEditWorkoutActions } from '@/hooks/workout/useEditWorkoutActions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function EditHistoryScreen() {
    const {
        addWorkoutModal,
        confirmModal,
        startTime,
        setStartTime,
        endTime,
        setEndTime,  
        editedNotes,
        setEditedNotes,
        editedRoutine,
        setEditedRoutine,
        handleSaveRoutine,
        handleConfirmSave,        
        openWorkoutModal,
        closeWorkoutModal,
        openConfirmModal,
        closeConfirmModal        
    } = useHookEditHistory();
    const { addExercise, updateSet, addSet, deleteSet, deleteExercise } = useEditWorkoutActions(editedRoutine, setEditedRoutine);

    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Title
                title={editedRoutine.title || 'Unnamed Routine'}
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
                    endTime={endTime!}
                    onChangeStartTime={setStartTime}
                    onChangeEndTime={setEndTime}
                />
                <NotesInput
                    value={editedNotes}
                    onChangeText={setEditedNotes}
                />
                <Workout
                    routine={editedRoutine}
                    open={openWorkoutModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
                    onDeleteSet={deleteSet} // Add this prop
                    onReplaceExercise={(exerciseId) => console.log(`Replace exercise ${exerciseId}`)}
                    onRemoveExercise={(exerciseId) => deleteExercise(exerciseId)}
                />
            </ScrollView>
            <AddExerciseModal
                visible={addWorkoutModal}
                close={closeWorkoutModal}
                mode="add"
                onSelect={addExercise}
            />
            <ConfirmationModal
                visible={confirmModal}
                message="Confirm changes?"
                onClose={closeConfirmModal}
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