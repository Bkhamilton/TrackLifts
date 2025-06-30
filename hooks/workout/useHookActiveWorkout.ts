import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { useWorkoutActions } from './useWorkoutActions';

export default function useHookActiveWorkout() {

    const router = useRouter();
    const { routine, resetRoutine } = useContext(ActiveWorkoutContext);

    const { deleteSet, deleteExercise } = useWorkoutActions();

    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [replaceWorkoutModal, setReplaceWorkoutModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const openWorkoutModal = () => setAddWorkoutModal(true);
    const closeWorkoutModal = () => setAddWorkoutModal(false);

    const openReplaceWorkoutModal = () => setReplaceWorkoutModal(true);
    const closeReplaceWorkoutModal = () => setReplaceWorkoutModal(false);

    const openConfirmModal = () => setConfirmModal(true);
    const closeConfirmModal = () => setConfirmModal(false);    

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
        replaceWorkoutModal,
        confirmModal,
        openWorkoutModal,
        closeWorkoutModal,
        openReplaceWorkoutModal,
        closeReplaceWorkoutModal,
        openConfirmModal,
        closeConfirmModal,
        handleConfirmSave
    };
}
