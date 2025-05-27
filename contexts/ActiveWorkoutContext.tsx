// app/contexts/BetContext/BetContext.tsx
import { ActiveRoutine, Exercise } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DBContext } from './DBContext';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: ActiveRoutine;
    setRoutine: React.Dispatch<React.SetStateAction<ActiveRoutine>>;
    updateRoutine: (routine: ActiveRoutine) => void;
    addToRoutine: (exercise: Exercise) => void;
    isActiveWorkout: boolean;
    setIsActiveWorkout: React.Dispatch<React.SetStateAction<boolean>>;
    startTime: number | null;
    startWorkout: () => void;
    addWorkoutToDatabase: (routine: ActiveRoutine) => Promise<void>;
    resetRoutine: () => void;
    // activeWorkout: Workout | null;
    // setActiveWorkout: (workout: Workout) => void;
    // addExerciseToWorkout: (exercise: Exercise) => void;
    // removeExerciseFromWorkout: (exerciseId: number) => void;
}

export const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue>({
    routine: {
        id: 0,
        title: 'Empty Workout',
        exercises: [],
    } as ActiveRoutine,
    setRoutine: () => {},
    updateRoutine: () => {},
    addToRoutine: () => {},
    isActiveWorkout: false,
    setIsActiveWorkout: () => {},
    startTime: null,
    startWorkout: () => {},
    addWorkoutToDatabase: async () => {},
    resetRoutine: () => {},
    // activeWorkout: null,
    // setActiveWorkout: () => {},
    // addExerciseToWorkout: () => {},
    // removeExerciseFromWorkout: () => {},
});

interface ActiveWorkoutContextValueProviderProps {
    children: ReactNode;
}

export const ActiveWorkoutContextProvider = ({ children }: ActiveWorkoutContextValueProviderProps) => {
    const db = useSQLiteContext();

    const { routines } = useContext(DBContext);

    const [startTime, setStartTime] = useState<number | null>(null);

    const [routine, setRoutine] = useState<ActiveRoutine>({
        id: 0,
        title: 'Empty Workout',
        exercises: [],
    } as ActiveRoutine);

    const [isActiveWorkout, setIsActiveWorkout] = useState(false);

    const updateRoutine = (updatedRoutine: ActiveRoutine) => {
        setRoutine(updatedRoutine);
    };

    const addToRoutine = (exercise: Exercise) => {
        const exerciseWithSets = {
            ...exercise,
            sets: [
                {
                    id: Date.now(), // Use a unique ID for the set
                    reps: 10, // Default reps
                    weight: 0, // Default weight
                    restTime: 60, // Default rest time in seconds
                    set_order: 1, // Set the order to 1
                },
            ],
        };
    
        setRoutine((prevRoutine) => ({
            ...prevRoutine,
            exercises: [...prevRoutine.exercises, exerciseWithSets],
        }));
    };

    const startWorkout = () => {
        setIsActiveWorkout(true);
        setStartTime(Date.now());
    };

    const addWorkoutToDatabase = async (routine: ActiveRoutine) => {
        if (db) {
            try {
                // Update the routine in the database to match the current routine state
                // await updateRoutineData(db, routine.id, routine);

                // For each exercise in the routine, insert a RoutineExercise entry
                /*
                for (const exercise of routine.exercises) {
                    const routineExerciseId = await insertRoutineExercise(db, {
                        routine_id: routine.id,
                        exercise_id: exercise.id,
                        sets: exercise.sets.length,
                    });

                    // Add each set to ExerciseSets
                    for (const set of exercise.sets) {
                        await insertExerciseSet(db, {
                            routine_exercise_id: routineExerciseId,
                            set_order: set.set_order,
                            weight: set.weight,
                            reps: set.reps,
                            date: new Date().toISOString(),
                        });
                    }
                }
                */
            } catch (error) {
                console.error('Error adding workout to database:', error);
            }
        }
    }

    const resetRoutine = () => {
        const defaultRoutine = {
            id: 0,
            title: 'Empty Workout',
            exercises: [],
        } as ActiveRoutine;
    
        if (routine.id !== 0) {
            // Try to find the initial routine
            const initialRoutine = routines.find(r => r.id === routine.id);
            setRoutine(initialRoutine || defaultRoutine);
        } else {
            setRoutine(defaultRoutine);
        }
    };

    const value = {
        routine,
        setRoutine,
        updateRoutine,
        addToRoutine,
        isActiveWorkout,
        setIsActiveWorkout,
        startTime,
        startWorkout,
        addWorkoutToDatabase,
        resetRoutine,
        // activeWorkout,
        // setActiveWorkout,
        // addExerciseToWorkout,
        // removeExerciseFromWorkout,
    };

    return (
        <ActiveWorkoutContext.Provider value={value}>
            {children}
        </ActiveWorkoutContext.Provider>
    );
};