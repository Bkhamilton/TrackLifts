import { RoutineContext } from '@/contexts/RoutineContext';
import { SplitContext } from '@/contexts/SplitContext';
import { ActiveRoutine } from '@/utils/types';
import { useRouter } from 'expo-router';
import { useContext } from 'react';

interface UseRoutineOptionsHandlerProps {
    routine: ActiveRoutine;
    onStart: (routine: ActiveRoutine) => void;
    closeOptionsModal: () => void;
    refreshFavorites: () => void;
    setRoutineToEdit?: (routine: ActiveRoutine) => void; // Only needed for HomeScreen
}

export default function useRoutineOptionsHandler({
    routine,
    onStart,
    closeOptionsModal,
    refreshFavorites,
    setRoutineToEdit,
}: UseRoutineOptionsHandlerProps) {
    const router = useRouter();
    const { deleteRoutineFromDB } = useContext(RoutineContext);
    const { toggleFavoriteRoutine } = useContext(SplitContext);

    const handleOption = async (option: string) => {
        switch (option) {
            case 'edit':
                if (setRoutineToEdit) setRoutineToEdit(routine);
                router.push('/(tabs)/(index)/editRoutine');
                break;
            case 'delete':
                deleteRoutineFromDB(routine.id)
                    .then(() => {
                        console.log('Routine deleted successfully');
                    })
                    .catch((error) => {
                        console.error('Error deleting routine:', error);
                    });
                break;
            case 'start':
                onStart(routine);
                break;
            case 'favorite':
                if (routine?.id) {
                    await toggleFavoriteRoutine(routine.id);
                    refreshFavorites();
                }
                break;
            default:
                console.warn('Unknown option selected:', option);
        }
        closeOptionsModal();
    };

    return handleOption;
}