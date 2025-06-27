import { ActiveRoutine, Exercise } from '@/constants/types';
import { RoutineContext } from '@/contexts/RoutineContext';
import { clearAllStorage } from '@/utils/exerciseUtils';
import { useRouter } from 'expo-router';
import { useContext } from 'react';

interface UseHomeActionsProps {
    closeAddRoutineModal: () => void;
    closeRoutineModal: () => void;
    closeSettingsModal: () => void;
    openNotificationModal: () => void;
    openPrivacySettingsModal: () => void;
    openHelpSupportModal: () => void;
    openAppearanceSettingsModal: () => void;
    openConfirmationModal: () => void;
    setRoutine: (routine: ActiveRoutine) => void;
    isActiveWorkout: boolean;
}

export default function useHomeActions({
    closeAddRoutineModal,
    closeRoutineModal,
    closeSettingsModal,
    openNotificationModal,
    openPrivacySettingsModal,
    openHelpSupportModal,
    openAppearanceSettingsModal,
    openConfirmationModal,
    setRoutine,
    isActiveWorkout,
} : UseHomeActionsProps) {
    const router = useRouter();
    const { addRoutineToDB } = useContext(RoutineContext);

    const onAdd = (routine: { title: string; exercises: Exercise[] }) => {
        const newRoutine = { ...routine, id: 0 };
        addRoutineToDB(newRoutine)
            .then((id) => {
                if (id) console.log('Routine added with ID:', id);
                else console.log('Failed to add routine');
            })
            .catch((error) => console.error('Error adding routine:', error));
        closeAddRoutineModal();
    };

    const onStart = (routine: ActiveRoutine) => {
        setRoutine(routine);
        closeRoutineModal();
        if (isActiveWorkout) {
            alert('You already have an active workout. Please finish it before starting a new one.');
            setTimeout(() => router.replace('/(tabs)/workout/activeWorkout'), 500);
        } else {
            router.replace('/(tabs)/workout/newWorkout');
        }
    };

    const onConfirmClearData = (choice: 'yes' | 'no') => {
        if (choice === 'yes') {
            clearAllStorage().then(() => {
                alert('All data cleared successfully.');
            });
        }
    }

    const onSelectSetting = (option: string) => {
        switch (option) {
            case 'editProfile':
            case 'editGoals':
                router.push('/(tabs)/profile/profileInfo');
                break;
            case 'notificationSettings':
                openNotificationModal();
                break;
            case 'privacySettings':
                openPrivacySettingsModal();
                break;
            case 'helpSupport':
                openHelpSupportModal();
                break;
            case 'exportData':
                router.navigate('/exportWorkout')
                break;
            case 'clearData':
                openConfirmationModal();
                break;
            case 'appearanceSettings':
                openAppearanceSettingsModal();
                break;
            default:
                console.warn('Unknown setting selected:', option);
        }
        closeSettingsModal();
    };

    return { 
        onAdd, 
        onStart, 
        onSelectSetting,
        onConfirmClearData 
    };
}