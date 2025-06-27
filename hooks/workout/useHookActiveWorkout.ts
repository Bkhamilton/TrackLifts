import { useState } from 'react';

export default function useHookActiveWorkout() {

    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const openWorkoutModal = () => setAddWorkoutModal(true);
    const closeWorkoutModal = () => setAddWorkoutModal(false);

    const openConfirmModal = () => setConfirmModal(true);
    const closeConfirmModal = () => setConfirmModal(false);

    return {
        addWorkoutModal,
        confirmModal,
        openWorkoutModal,
        closeWorkoutModal,
        openConfirmModal,
        closeConfirmModal
    };
}
