// app/contexts/RoutineContext.tsx
import { deleteExerciseSetsByRoutineId, insertExerciseSet } from '@/db/user/ExerciseSets';
import { deleteRoutineExerciseByRoutineId, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { deleteRoutine, insertRoutine } from '@/db/user/Routines';
import { getRoutineData } from '@/utils/routineHelpers';
import { ActiveRoutine, Routine } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';

interface RoutineContextValue {
    routines: ActiveRoutine[];
    addRoutineToDB: (routine: Routine) => Promise<number | undefined>;
    deleteRoutineFromDB: (routineId: number) => Promise<void>;
    refreshRoutines: () => void;
}

export const RoutineContext = createContext<RoutineContextValue>({
    routines: [],
    addRoutineToDB: async () => {
        return undefined;
    },
    deleteRoutineFromDB: async () => {
        return;
    },
    refreshRoutines: () => {
        // This function can be used to refresh routines if needed
    },
});

interface RoutineContextValueProviderProps {
    children: ReactNode;
}

export const RoutineContextProvider = ({ children }: RoutineContextValueProviderProps) => {

    const { db, user } = useContext(DBContext);

    const [routines, setRoutines] = useState<ActiveRoutine[]>([]);

    const addRoutineToDB = async (routine: Routine): Promise<number | undefined> => {
        if (db) {
            try {
                // Insert the routine into the database and get the inserted ID
                const routineId = await insertRoutine(db, {
                    title: routine.title,
                    user_id: user.id,
                });

                // For each exercise in the routine, insert a RoutineExercise entry
                for (const exercise of routine.exercises) {
                    const routineExerciseId = await insertRoutineExercise(db, {
                        routine_id: routineId,
                        exercise_id: exercise.id,
                        sets: 1,
                    });

                    // Add Default Set to ExerciseSets (routine_exercise_id, set_order, weight, reps, date)
                    await insertExerciseSet(db, {
                        routine_exercise_id: routineExerciseId,
                        set_order: 1,
                        weight: 0,
                        reps: 8,
                        date: new Date().toISOString(),
                    })
                }

                // Update the routines state with the new routine, including the returned ID
                getRoutineData(db, user.id).then((data) => {
                    setRoutines(data || []);
                });

                return routineId; // Return the ID of the newly inserted routine
            } catch (error) {
                console.error('Error adding routine to DB:', error);
                return undefined; // Return undefined in case of an error
            }
        }
        return undefined; // Return undefined if the database is not available
    }

    const deleteRoutineFromDB = async (routineId: number): Promise<void> => {
        if (db) {
            try {
                // Delete the routine from the database
                await deleteRoutine(db, routineId);
                // also delete the associated RoutineExercises and ExerciseSets entries
                await deleteRoutineExerciseByRoutineId(db, routineId);
                await deleteExerciseSetsByRoutineId(db, routineId);

                // Update the routines state to remove the deleted routine
                setRoutines((prevRoutines) =>
                    prevRoutines.filter((routine) => routine.id !== routineId)
                );
            } catch (error) {
                console.error('Error deleting routine from DB:', error);
            }
        }
    }

    const refreshRoutines = () => {
        if (db && user.id !== 0) {
            getRoutineData(db, user.id).then((data) => {
                setRoutines(data || []);
            });
        }
    };

    useEffect(() => {
        if (db && user.id !== 0) {
            getRoutineData(db, user.id).then((data) => {
                setRoutines(data || []);
            });
        }
    }, [db, user.id]);

    const value = {
        routines,
        addRoutineToDB,
        deleteRoutineFromDB,
        refreshRoutines,
    };

    return (
        <RoutineContext.Provider value={value}>
            {children}
        </RoutineContext.Provider>
    );
};
