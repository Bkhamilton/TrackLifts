import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { useWorkoutActions } from './useWorkoutActions';

export default function useHookActiveWorkout() {

    const router = useRouter();
    const { routine, resetRoutine } = useContext(ActiveWorkoutContext);

    const { deleteSet, deleteExercise } = useWorkoutActions();

    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [completedSets, setCompletedSets] = useState<number[]>([]);

    const totalSets = routine.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const allSetsCompleted = totalSets > 0 && completedSets.length === totalSets;    

    const openWorkoutModal = () => setAddWorkoutModal(true);
    const closeWorkoutModal = () => setAddWorkoutModal(false);

    const openConfirmModal = () => setConfirmModal(true);
    const closeConfirmModal = () => setConfirmModal(false);

    const toggleSetComplete = (exerciseId: number, setId: number) => {
        setCompletedSets(prev => {
            if (prev.includes(setId)) {
                return prev.filter(id => id !== setId);
            } else {
                return [...prev, setId];
            }
        });
    };    

    const handleDeleteSet = (exerciseId: number, setId: number) => {
        deleteSet(exerciseId, setId);
        // Remove the set from completed sets if it was there
        setCompletedSets(prev => prev.filter(id => id !== setId));
    };    

    const handleDeleteExercise = (exerciseId: number) => {
        deleteExercise(exerciseId);
        // Remove all sets of the deleted exercise from completed sets
        setCompletedSets(prev => prev.filter(id => !routine.exercises.find(ex => ex.id === exerciseId)?.sets.some(set => set.id === id)));
    };    

    const handleConfirmSave = (option: 'yes' | 'no') => {
        if (option === 'yes') {
            // Save no changes and go back
            resetRoutine();
            closeConfirmModal();
            router.replace('/(tabs)/workout/newWorkout');
        } else {
            // Do nothing, just close the modal
            closeConfirmModal();
        }
    }    

    return {
        addWorkoutModal,
        confirmModal,
        completedSets,
        setCompletedSets,
        allSetsCompleted,
        openWorkoutModal,
        closeWorkoutModal,
        openConfirmModal,
        closeConfirmModal,
        toggleSetComplete,
        handleDeleteSet,
        handleDeleteExercise,
        handleConfirmSave
    };
}
