// app/contexts/RoutineContext.tsx
import { clearExerciseSets, deleteExerciseSetsByRoutineId, insertExerciseSet } from '@/db/user/ExerciseSets';
import { clearRoutineExercises, deleteRoutineExerciseByRoutineId, getRoutineExercise, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { deleteRoutine, insertRoutine } from '@/db/user/Routines';
import { getRoutineData } from '@/utils/routineHelpers';
import { ActiveRoutine, Routine } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface RoutineContextValue {
    routines: ActiveRoutine[];
    addRoutineToDB: (routine: Routine) => Promise<number | undefined>;
    deleteRoutineFromDB: (routineId: number) => Promise<void>;
    updateRoutineInDB: (routine: ActiveRoutine) => Promise<void>;
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
    updateRoutineInDB: async () => {
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

    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

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

    const updateRoutineInDB = async (routine: ActiveRoutine): Promise<void> => {
        if (!db) return;
        if (!routine.id || routine.id === 0) {
            throw new Error('Routine ID is required to update a routine.');
        }

        await db.runAsync('BEGIN TRANSACTION');
        try {
            // 1. Clear existing RoutineExercises for this routine
            await clearRoutineExercises(db, routine.id);

            // 2. Insert new RoutineExercises and update ExerciseSets
            for (const exercise of routine.exercises) {
                await insertRoutineExercise(db, {
                    routine_id: routine.id,
                    exercise_id: exercise.id,
                });

                // Clear existing ExerciseSets for this routine/exercise
                await clearExerciseSets(db, routine.id, exercise.id);

                // Get the routine_exercise row just inserted
                const routineExercise = await getRoutineExercise(db, routine.id, exercise.id);
                if (routineExercise) {
                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        await insertExerciseSet(db, {
                            routine_exercise_id: routineExercise.id,
                            set_order: i + 1,
                            weight: set.weight,
                            reps: set.reps,
                            date: new Date().toISOString(),
                        });
                    }
                }
            }

            await db.runAsync('COMMIT');
        } catch (error) {
            await db.runAsync('ROLLBACK');
            throw error;
        }
    };

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
        updateRoutineInDB,
        refreshRoutines,
    };

    return (
        <RoutineContext.Provider value={value}>
            {children}
        </RoutineContext.Provider>
    );
};
