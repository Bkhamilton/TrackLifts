import { ActiveRoutine, Exercise } from '@/constants/types';
import { RoutineContext } from '@/contexts/RoutineContext';
import { clearAllStorage } from '@/utils/debugTools';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { useContext } from 'react';
import { Alert } from 'react-native';

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

    const onConfirmClearData = async (choice: 'yes' | 'no') => {
        if (choice === 'yes') {
            try {
                await clearAllStorage();
                
                Alert.alert(
                    'Data Cleared Successfully',
                    'All data has been cleared. The app will now restart to complete the process.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                try {
                                    await Updates.reloadAsync();
                                } catch (error) {
                                    console.error('Error restarting app:', error);
                                    // Fallback: just show a message if reload fails
                                    Alert.alert(
                                        'Please Restart App',
                                        'Please manually close and reopen the app to complete the data clearing process.'
                                    );
                                }
                            }
                        }
                    ]
                );
            } catch (error) {
                console.error('Error clearing data:', error);
                Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
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