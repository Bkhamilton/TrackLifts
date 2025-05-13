// app/contexts/BetContext/BetContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { getExercises, insertExercise } from '@/db/general/Exercises';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getMuscles } from '@/db/general/Muscles';
import { insertRoutineExercise } from '@/db/user/RoutineExercises';
import { insertRoutine } from '@/db/user/Routines';
import { getUserById } from '@/db/user/Users';
import { getRoutineData } from '@/utils/routineHelpers';
import { Exercise, MuscleGroup, Routine } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
/*



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
    addExerciseToDB: (exercise: Exercise) => Promise<number | undefined>;
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
    addExerciseToDB: async () => {
        return undefined;
    },
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

    const addExerciseToDB = async (exercise: Exercise): Promise<number | undefined> => {
        if (db) {
            try {
                // Insert the exercise into the database and get the inserted ID
                const exerciseId = await insertExercise(db, exercise);
    
                // Update the exercises state with the new exercise, including the returned ID
                setExercises((prevExercises) => [
                    ...prevExercises,
                    { ...exercise, id: exerciseId }, // Add the ID to the exercise object
                ]);
    
                return exerciseId; // Return the ID of the newly inserted exercise
            } catch (error) {
                console.error('Error adding exercise to DB:', error);
                return undefined; // Return undefined in case of an error
            }
        }
        return undefined; // Return undefined if the database is not available
    };

    const addRoutineToDB = async (routine: Routine): Promise<number | undefined> => {
        if (db) {
            try {
                // Insert the routine into the database and get the inserted ID
                const routineId = await insertRoutine(db, routine);

                // For each exercise in the routine, insert a RoutineExercise entry
                for (const exercise of routine.exercises) {
                    await insertRoutineExercise(db, {
                        routineId,
                        exerciseId: exercise.id,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        weight: exercise.weight,
                    });
                }

                // Update the routines state with the new routine, including the returned ID
                setRoutines((prevRoutines) => [
                    ...prevRoutines,
                    { ...routine, id: routineId }, // Add the ID to the routine object
                ]);
            } catch (error) {
                console.error('Error adding routine to DB:', error);
                return undefined; // Return undefined in case of an error
            }
        }
        return undefined; // Return undefined if the database is not available
    }

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
            getMuscles(db).then((data) => {
                setMuscles(data);
            });
        }
    }, [db]);

    useEffect(() => {
        if (db && user.id !== 0) {
            const fetchRoutines = async () => {
                const data = await getRoutineData(db, user.id);
                setRoutines(data || []);
            }

            fetchRoutines();
        }
    }, [db, user]);

    const value = {
        db,
        user,
        exercises,
        equipment,
        muscles,
        muscleGroups,
        routines,
        addExerciseToDB,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};