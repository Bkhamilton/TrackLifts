// app/contexts/BetContext/BetContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { deleteExerciseMuscleByExerciseId, insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { deleteExercise, insertExercise } from '@/db/general/Exercises';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getMuscles } from '@/db/general/Muscles';
import { deleteExerciseSetsByExerciseId, deleteExerciseSetsByRoutineId, insertExerciseSet } from '@/db/user/ExerciseSets';
import { deleteRoutineExerciseByRoutineId, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { deleteRoutine, insertRoutine } from '@/db/user/Routines';
import { getUserById } from '@/db/user/Users';
import { getExerciseData } from '@/utils/exerciseHelpers';
import { getRoutineData } from '@/utils/routineHelpers';
import { getSplitData } from '@/utils/splitHelpers';
import { ActiveRoutine, Exercise, MuscleGroup, Routine, Splits } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

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
    muscles: any[];
    muscleGroups: MuscleGroup[];
    routines: ActiveRoutine[];
    splits: Splits[];
    activeSplit: Splits | null;
    addExerciseToDB: (exercise: Exercise) => Promise<number | undefined>;
    addRoutineToDB: (routine: Routine) => Promise<number | undefined>;
    deleteExerciseFromDB: (exerciseId: number) => Promise<void>;
    deleteRoutineFromDB: (routineId: number) => Promise<void>;
    refreshRoutines: () => void;
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
    muscles: [],
    muscleGroups: [],
    routines: [],
    splits: [],
    activeSplit: null,
    addExerciseToDB: async () => {
        return undefined;
    },
    addRoutineToDB: async () => {
        return undefined;
    },
    deleteExerciseFromDB: async () => {
        return;
    },
    deleteRoutineFromDB: async () => {
        return;
    },
    refreshRoutines: () => {
        // This function can be used to refresh routines if needed
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
    const [routines, setRoutines] = useState<ActiveRoutine[]>([]);
    const [splits, setSplits] = useState<Splits[]>([]);
    const [activeSplit, setActiveSplit] = useState<Splits | null>(null);

    const addExerciseToDB = async (exercise: Exercise): Promise<number | undefined> => {
        if (db) {
            try {
                // Insert the exercise into the database and get the inserted ID
                const exerciseId = await insertExercise(db, exercise);

                // For each muscle in the exercise, insert a ExerciseMuscles entry
                if (exercise.muscles) {
                    for (const muscle of exercise.muscles) {
                        await insertExerciseMuscle(db, {
                            exerciseId,
                            muscleId: muscle.id,
                            intensity: muscle.intensity,
                        });
                    }
                }
    
                // Update the exercises state with the new exercise, including the returned ID
                getExerciseData(db).then((data) => {
                    setExercises(data || []);
                });
    
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

    const deleteExerciseFromDB = async (exerciseId: number): Promise<void> => {
        if (db) {
            try {
                // Delete the exercise from the database
                await deleteExercise(db, exerciseId);
                // also delete the associated ExerciseMuscles and ExerciseSets entries
                await deleteExerciseMuscleByExerciseId(db, exerciseId);
                await deleteExerciseSetsByExerciseId(db, exerciseId);

                // Update the exercises state to remove the deleted exercise
                setExercises((prevExercises) =>
                    prevExercises.filter((exercise) => exercise.id !== exerciseId)
                );
            } catch (error) {
                console.error('Error deleting exercise from DB:', error);
            }
        }
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
        if (db) {
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
        if (db) {
            const fetchExercises = async () => {
                const data = await getExerciseData(db);
                setExercises(data || []);
            }

            fetchExercises();
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

    useEffect(() => {
        if (db && user.id !== 0) {
            const fetchSplits = async () => {
                const data = await getSplitData(db, user.id);
                setSplits(data || []);
                for (const split of data || []) {
                    if (split.is_active) {
                        setActiveSplit(split);
                        break;
                    }
                }
            }

            fetchSplits();
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
        splits,
        activeSplit,
        addExerciseToDB,
        addRoutineToDB,
        deleteExerciseFromDB,
        deleteRoutineFromDB,
        refreshRoutines,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};
