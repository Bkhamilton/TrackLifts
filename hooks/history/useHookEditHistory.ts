import { workoutDuration, finishFromDuration } from '@/utils/workoutDuration';
import { Alert } from 'react-native';
import { HistoryContext } from '@/contexts/HistoryContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';

export default function useHookHistory() {

    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const router = useRouter();

    const { history } = useContext(HistoryContext);
    const { updateWorkout } = useContext(WorkoutContext);
    const [startTime, setStartTime] = useState(history.startTime);
    const [endTime, setEndTime] = useState(workoutDuration(history.startTime, history.endTime));
    const [editedNotes, setEditedNotes] = useState(history.notes);
    const [editedRoutine, setEditedRoutine] = useState(history.routine);

    const openWorkoutModal = () => setAddWorkoutModal(true);
    const closeWorkoutModal = () => setAddWorkoutModal(false);

    const openConfirmModal = () => setConfirmModal(true);
    const closeConfirmModal = () => setConfirmModal(false);

    const handleSaveRoutine = () => {
        // If editedRoutine is different from history.routine, show confirmation modal
        if (JSON.stringify(editedRoutine) !== JSON.stringify(history.routine) || 
        editedNotes !== history.notes ||
        startTime !== history.startTime ||
        endTime !== workoutDuration(history.startTime, history.endTime)) {
            openConfirmModal();
        } else {
            router.replace('/(tabs)/history/main');
        }
    }

    const handleConfirmSave = async (option: 'yes' | 'no') => {
        if (option === 'yes') {
            // Save the changes to the routine
            const updatedHistory = {
                ...history,
                routine: editedRoutine,
                notes: editedNotes,
                startTime,
                endTime,
            };
            try {
                const unchangedTimes = startTime === history.startTime && endTime === workoutDuration(history.startTime, history.endTime);
                await updateWorkout({ ...updatedHistory, endTime: unchangedTimes ? history.endTime : finishFromDuration(startTime, endTime) });
            } catch (error) {
                Alert.alert('Changes not saved', error instanceof Error ? error.message : 'Please try again.');
                return;
            }
            router.replace('/(tabs)/history/main');
        }
    }    

    return {
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
    };
}
