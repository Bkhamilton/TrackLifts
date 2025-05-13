import { useState } from 'react';

const useHookHome = () => {

    const [addRoutineModal, setAddRoutineModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [routineModal, setRoutineModal] = useState(false);
    const [routineOptionsModal, setRoutineOptionsModal] = useState(false);

    const [routine, setRoutine] = useState({
        id: 0,
        title: 'Test Routine',
        exercises: []
    });

    const openAddRoutineModal = () => setAddRoutineModal(true);
    const closeAddRoutineModal = () => setAddRoutineModal(false);

    const openProfileModal = () => setProfileModal(true);
    const closeProfileModal = () => setProfileModal(false);

    const openSettingsModal = () => setSettingsModal(true);
    const closeSettingsModal = () => setSettingsModal(false);

    const openRoutineModal = (routine) => {
        setRoutine(routine);
        setRoutineModal(true);
    }
    const closeRoutineModal = () => setRoutineModal(false);

    const openRoutineOptionsModal = (routine) => {
        setRoutine(routine);
        setRoutineOptionsModal(true);
    }
    const closeRoutineOptionsModal = () => setRoutineOptionsModal(false);

    return {
        addRoutineModal,
        openAddRoutineModal,
        closeAddRoutineModal,
        profileModal,
        openProfileModal,
        closeProfileModal,
        settingsModal,
        openSettingsModal,
        closeSettingsModal,
        routineModal,
        openRoutineModal,
        closeRoutineModal,
        routineOptionsModal,
        openRoutineOptionsModal,
        closeRoutineOptionsModal,
        routine,
    };
};

export default useHookHome;