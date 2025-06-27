import { ActiveRoutine } from '@/constants/types';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import { RoutineContext } from '@/contexts/RoutineContext';
import { UserContext } from '@/contexts/UserContext';
import { getFavoriteRoutineIds } from '@/db/user/RoutineFavorites';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';

export default function useHookRoutines({ favoritesRefreshKey = 0 }: { favoritesRefreshKey?: number } = {}) {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);
    const { routines } = useContext(RoutineContext);
    const { isActiveWorkout, setRoutine } = useContext(ActiveWorkoutContext);
    const [routineOptionsModal, setRoutineOptionsModal] = useState(false);
    const [routineModal, setRoutineModal] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [addRoutineModal, setAddRoutineModal] = useState(false);
    const [routine, setSelectRoutine] = useState<ActiveRoutine>({
        id: 0,
        title: 'Test Routine',
        exercises: []
    });

    const [favoriteRoutineIds, setFavoriteRoutineIds] = useState<number[]>([]);

    useEffect(() => {
        if (db && user?.id) {
            getFavoriteRoutineIds(db, user.id).then(setFavoriteRoutineIds);
        }
    }, [db, user, routines, favoritesRefreshKey]);


    const router = useRouter();

    const openRoutine = (routine: ActiveRoutine) => {
        setSelectRoutine(routine);
        setRoutineModal(true);
    };
    const openRoutineOptions = (routine: ActiveRoutine) => {
        setSelectRoutine(routine);
        setRoutineOptionsModal(true);
    };

    const onStart = (routine: ActiveRoutine) => {
        setRoutine(routine);
        setRoutineModal(false);
        if (isActiveWorkout) {
            alert('You already have an active workout. Please finish it before starting a new one.');
            setTimeout(() => {
                router.replace('/(tabs)/workout/activeWorkout');
            }, 500);
        } else {
            router.replace('/(tabs)/workout/newWorkout');
        }
    };

    const handleSearchSelect = (selectedRoutine: ActiveRoutine) => {
        setSearchModalVisible(false);
        openRoutine(selectedRoutine);
    };

    return {
        routines,
        favoriteRoutineIds,
        routine,
        routineModal,
        routineOptionsModal,
        addRoutineModal,
        setRoutineModal,
        setRoutineOptionsModal,
        setAddRoutineModal,
        openRoutine,
        openRoutineOptions,
        onStart,
        searchModalVisible,
        setSearchModalVisible,
        handleSearchSelect
    };
}
