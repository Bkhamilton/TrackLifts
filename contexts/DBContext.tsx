// app/contexts/BetContext/BetContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { getExercises } from '@/db/general/Exercises';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getRoutinesByUserId } from '@/db/user/Routines';
import { getUserById } from '@/db/user/Users';
import { Exercise, MuscleGroup, Routine } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
/*

import { getMuscles } from '@/db/general/Muscles';

import { getExerciseMuscles } from '@/db/general/ExerciseMuscles';

*/

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface DBContextValue {
    db: any;
    user: User;
    exercises: Exercise[];
    equipment: any[];
    muscleGroups: MuscleGroup[];
    routines: Routine[];
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    user: {
        id: 0,
        name: '',
        email: '',
        password: '',
    },
    exercises: [],
    equipment: [],
    muscleGroups: [],
    routines: [],
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [isLoading, setIsLoading] = useState(true);

    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        email: '',
        password: '',
    });

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [muscles, setMuscles] = useState<any[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        if (db) {
            getExercises(db).then((data) => {
                setExercises(data);
                setIsLoading(false);
            });
            getUserById(db, 1).then((data) => {
                setUser(data);
            });
            getEquipment(db).then((data) => {
                setEquipment(data);
            });
            getMuscleGroups(db).then((data) => {
                setMuscleGroups(data);
            });
        }
    }, [db]);

    useEffect(() => {
        if (db && user.id !== 0) {
            getRoutinesByUserId(db, user.id).then((data) => {
                setRoutines(data);
            });
        }
    }, [db, user]);

    const value = {
        db,
        user,
        exercises,
        equipment,
        muscleGroups,
        routines,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};