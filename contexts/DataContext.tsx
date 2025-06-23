// app/contexts/DataContext.tsx
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import { getTopExericise } from '@/db/workout/SessionExercises'; // Assuming this function exists
import { getWeeklySetCount } from '@/db/workout/SessionSets';
import { getWeeklyWorkoutCount, getWorkoutCountByUser } from '@/db/workout/WorkoutSessions';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface DataContextValue {
    favoriteRoutines: any[];
    totalWorkoutCount: number;
    weeklyWorkoutCount: number;
    weeklySetsCount: number;
    topExercise: any;
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
    totalWorkoutCount: 0,
    weeklyWorkoutCount: 0,
    weeklySetsCount: 0,
    topExercise: null,
});

interface DataContextValueProviderProps {
    children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [favoriteRoutines, setFavoriteRoutines] = useState<any[]>([]);
    const [totalWorkoutCount, setTotalWorkoutCount] = useState<number>(0);
    const [weeklyWorkoutCount, setWeeklyWorkoutCount] = useState<number>(0);
    const [weeklySetsCount, setWeeklySetsCount] = useState<number>(0);
    const [topExercise, setTopExercise] = useState<any>(null);

    useEffect(() => {
        if (db && user.id !== 0) {
            getFavoriteRoutinesByUser(db, user.id).then((routines) => {
                console.log('Favorite routines:', JSON.stringify(routines, null, 2));
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
