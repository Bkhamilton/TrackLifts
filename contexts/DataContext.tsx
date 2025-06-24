// app/contexts/DataContext.tsx
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import { getTotalMuscleGroupFocus } from '@/db/data/MuscleGroupFocus';
import { getTopExericise } from '@/db/workout/SessionExercises'; // Assuming this function exists
import { getWeeklySetCount } from '@/db/workout/SessionSets';
import { getMonthlyWorkoutCount, getQuarterlyWorkoutCount, getWeeklyWorkoutCount, getWorkoutCountByUser, getYearlyWorkoutCount } from '@/db/workout/WorkoutSessions';
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
    refreshData: () => void;
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
    refreshData: () => {
        console.warn('refreshData function not implemented');
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
        }
    }

    useEffect(() => {
        refreshData();
    }, [db, user]);

    const value = {
        favoriteRoutines,
        weeklySetsCount,
        topExercise,
        muscleGroupFocusBySet,
        workoutCount,
        refreshData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
