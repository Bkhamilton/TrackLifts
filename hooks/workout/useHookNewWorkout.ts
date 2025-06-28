import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';

export default function useHookActiveWorkout() {

    const { startWorkout } = useContext(ActiveWorkoutContext);

    const router = useRouter();

    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [optionsModal, setOptionsModal] = useState(false);

    const openWorkoutModal = () => setAddWorkoutModal(true);
    const closeWorkoutModal = () => setAddWorkoutModal(false);

    const openOptionsModal = () => setOptionsModal(true);
    const closeOptionsModal = () => setOptionsModal(false);

    const onStartWorkout = () => {
        startWorkout();
        router.push('/(tabs)/workout/activeWorkout');
    }    

    return {
        addWorkoutModal,
        optionsModal,
        openWorkoutModal,
        closeWorkoutModal,
        openOptionsModal,
        closeOptionsModal,
        onStartWorkout
    };
}
