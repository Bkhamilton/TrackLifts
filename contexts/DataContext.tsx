// app/contexts/DataContext.tsx
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import { getTopExericise } from '@/db/workout/SessionExercises'; // Assuming this function exists
import { getWeeklySetCount } from '@/db/workout/SessionSets';
import { getWeeklyWorkoutCount, getWorkoutCountByUser } from '@/db/workout/WorkoutSessions';
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

interface DataContextValue {
    favoriteRoutines: FavoriteRoutine[];
    totalWorkoutCount: number;
    weeklyWorkoutCount: number;
    weeklySetsCount: number;
    topExercise: TopExercise;
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
    totalWorkoutCount: 0,
    weeklyWorkoutCount: 0,
    weeklySetsCount: 0,
    topExercise: {
        id: 0,
        title: '',
        sessionCount: 0,
    },
});

interface DataContextValueProviderProps {
    children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [favoriteRoutines, setFavoriteRoutines] = useState<FavoriteRoutine[]>([]);
    const [totalWorkoutCount, setTotalWorkoutCount] = useState<number>(0);
    const [weeklyWorkoutCount, setWeeklyWorkoutCount] = useState<number>(0);
    const [weeklySetsCount, setWeeklySetsCount] = useState<number>(0);
    const [topExercise, setTopExercise] = useState<TopExercise>({
        id: 0,
        title: '',
        sessionCount: 0,
    });

    useEffect(() => {
        if (db && user.id !== 0) {
            getFavoriteRoutinesByUser(db, user.id).then((routines) => {
                setFavoriteRoutines(routines);
            });
            getWorkoutCountByUser(db, user.id).then((count) => {
                setTotalWorkoutCount(count);
            });
            getWeeklyWorkoutCount(db, user.id).then((count) => {
                setWeeklyWorkoutCount(count);
            });
            getWeeklySetCount(db, user.id).then((count) => {
                setWeeklySetsCount(count);
            });
            getTopExericise(db, user.id).then((exercise) => {
                setTopExercise(exercise);
            });
        }
    }, [db, user]);

    const value = {
        favoriteRoutines,
        totalWorkoutCount,
        weeklyWorkoutCount,
        weeklySetsCount,
        topExercise,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
