// app/contexts/BetContext/BetContext.tsx
import { getExercises } from '@/db/general/Exercises';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
/*

import { getMuscles } from '@/db/general/Muscles';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getExerciseMuscles } from '@/db/general/ExerciseMuscles';
import { getRoutinesByUserId } from '@/db/user/Routines';
*/

interface Exercise {
    id: number;
    title: string;
    muscleGroupId: number;
    muscleGroup: string;
}

interface DBContextValue {
    db: any;
    exercises: Exercise[];
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    exercises: [],
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [isLoading, setIsLoading] = useState(true);

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [muscles, setMuscles] = useState<any[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<any[]>([]);
    const [routines, setRoutines] = useState<any[]>([]);

    useEffect(() => {
        if (db) {
            getExercises(db).then((data) => {
                setExercises(data);
                setIsLoading(false);
            });
        }
    }, [db]);

    const value = {
        db,
        exercises,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};