// app/contexts/DataContext.tsx
import { getExerciseSessionStats } from '@/db/data/ExerciseSessionStats';
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import { getTotalMuscleGroupFocus } from '@/db/data/MuscleGroupFocus';
import { getMuscleGroupIntensity } from '@/db/data/MuscleGroupIntensity';
import { getTopExericise } from '@/db/workout/SessionExercises';
import { getWeeklySetCount } from '@/db/workout/SessionSets';
import { getMonthlyWorkoutCount, getQuarterlyWorkoutCount, getWeeklyWorkoutCount, getWorkoutCountByUser, getYearlyWorkoutCount } from '@/db/workout/WorkoutSessions';
import { dataEvents } from '@/utils/events';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface FavoriteRoutine {
    routine_id: number;
    routine_title: string;
    usage_count: number;
    last_used: string;
}

interface TopExercise {
    id: number;
    title: string;
    sessionCount: number;
}

interface MuscleGroupStat {
    muscle_group: string;
    total_intensity: number;
}

interface DataContextValue {
    favoriteRoutines: FavoriteRoutine[];
    weeklySetsCount: number;
    topExercise: TopExercise;
    muscleGroupFocusBySet: MuscleGroupStat[];
    workoutCount: {
        total: number;
        weekly: number;
        monthly: number;
        quarterly: number;
        yearly: number;
    };
    muscleGroupIntensity: any[];
    refreshData: () => void;
    fetchExerciseSessionStats: (
        exerciseId: number,
        startDate: string,
        endDate: string
    ) => Promise<any[]>;
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
    weeklySetsCount: 0,
    topExercise: {
        id: 0,
        title: '',
        sessionCount: 0,
    },
    muscleGroupFocusBySet: [],
    workoutCount: {
        total: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
    },
    muscleGroupIntensity: [],
    refreshData: () => {
        console.warn('refreshData function not implemented');
    },
    fetchExerciseSessionStats: async () => {
        console.warn('fetchExerciseSessionStats function not implemented');
        return [];
    },
});

interface DataContextValueProviderProps {
    children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [favoriteRoutines, setFavoriteRoutines] = useState<FavoriteRoutine[]>([]);
    const [workoutCount, setWorkoutCount] = useState<any>({
        total: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
    })
    const [weeklySetsCount, setWeeklySetsCount] = useState<number>(0);
    const [topExercise, setTopExercise] = useState<TopExercise>({
        id: 0,
        title: '',
        sessionCount: 0,
    });
    const [muscleGroupFocusBySet, setMuscleGroupFocusBySet] = useState<MuscleGroupStat[]>([]);
    const [muscleGroupIntensity, setMuscleGroupIntensity] = useState<any[]>([]);

    const refreshData = () => {
        if (db && user.id !== 0) {
            getFavoriteRoutinesByUser(db, user.id).then((routines) => {
                setFavoriteRoutines(routines);
            });
            getWorkoutCountByUser(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    total: count,
                }));
            });
            getWeeklyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    weekly: count,
                }));
            });
            getMonthlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    monthly: count,
                }));
            });
            getQuarterlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    quarterly: count,
                }));
            });
            getYearlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    yearly: count,
                }));
            });
            getWeeklySetCount(db, user.id).then((count) => {
                setWeeklySetsCount(count);
            });
            getTopExericise(db, user.id).then((exercise) => {
                setTopExercise(exercise);
            });
            getTotalMuscleGroupFocus(db).then((stats) => {
                setMuscleGroupFocusBySet(stats);
            });
            getMuscleGroupIntensity(db, user.id).then((intensity) => {
                setMuscleGroupIntensity(intensity);
            });
        }
    }

    const fetchExerciseSessionStats = async (
        exerciseId: number,
        startDate: string,
        endDate: string
    ) => {
        if (!db || !user?.id || !exerciseId) return [];
        try {
            return await getExerciseSessionStats(db, user.id, exerciseId, startDate, endDate);
        } catch (e) {
            console.error('Failed to fetch exercise session stats:', e);
            return [];
        }
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        dataEvents.addEventListener('refreshData', handler);
        return () => dataEvents.removeEventListener('refreshData', handler);
    }, [db, user]);

    const value = {
        favoriteRoutines,
        weeklySetsCount,
        topExercise,
        muscleGroupFocusBySet,
        workoutCount,
        muscleGroupIntensity,
        refreshData,
        fetchExerciseSessionStats,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
