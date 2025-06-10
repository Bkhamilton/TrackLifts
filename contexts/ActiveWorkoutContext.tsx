// app/contexts/BetContext/BetContext.tsx
import { clearExerciseSets, insertExerciseSet } from '@/db/user/ExerciseSets';
import { clearRoutineExercises, getRoutineExercise, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { insertSessionExercise } from '@/db/workout/SessionExercises';
import { insertSessionSet } from '@/db/workout/SessionSets';
import { insertWorkoutSession } from '@/db/workout/WorkoutSessions';
import { ActiveRoutine, Exercise, Workout } from '@/utils/types';
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
    finalTime: string | null;
    setFinalTime: React.Dispatch<React.SetStateAction<string | null>>;
    startWorkout: () => void;
    saveWorkoutToDatabase: (workout: Workout) => Promise<number>;
    resetRoutine: () => void;
    clearRoutine: () => void;
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
    finalTime: null,
    setFinalTime: () => {},
    startWorkout: () => {},
    saveWorkoutToDatabase: async () => {
        return 0; // Placeholder return value
    },
    resetRoutine: () => {},
    clearRoutine: () => {},
});

interface ActiveWorkoutContextValueProviderProps {
    children: ReactNode;
}

export const ActiveWorkoutContextProvider = ({ children }: ActiveWorkoutContextValueProviderProps) => {
    const db = useSQLiteContext();

    const { routines, user, refreshRoutines } = useContext(DBContext);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [finalTime, setFinalTime] = useState<string | null>(null);

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

        // If title is Empty Workout, set a title based on the day and time ('Monday Morning Workout', etc.)
        if (routine.title === 'Empty Workout') {
            const date = new Date();
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

            const hour = date.getHours();
            let timeOfDay = '';
            if (hour >= 5 && hour < 12) {
                timeOfDay = 'Morning';
            } else if (hour >= 12 && hour < 18) {
                timeOfDay = 'Afternoon';
            } else {
                timeOfDay = 'Night';
            }

            const formattedTitle = `${weekday} ${timeOfDay} Workout`;
            setRoutine((prevRoutine) => ({
                ...prevRoutine,
                title: formattedTitle,
            }));
        }
    
        setRoutine((prevRoutine) => ({
            ...prevRoutine,
            exercises: [...prevRoutine.exercises, exerciseWithSets],
        }));
    };

    const startWorkout = () => {
        setIsActiveWorkout(true);
        setStartTime(Date.now());
    };

    const saveWorkoutToDatabase = async (workout: Workout) => {
        // 1. Update RoutineExercises if structure changed
        await db.runAsync('BEGIN TRANSACTION');
        try {
            // Clear existing routine exercises
            await clearRoutineExercises(db, workout.routine.id);
            
            // Recreate with current structure
            for (const exercise of workout.routine.exercises) {
                await insertRoutineExercise(db, {
                    routine_id: workout.routine.id,
                    exercise_id: exercise.id
                });
            }
            await db.runAsync('COMMIT');
        } catch (error) {
            await db.runAsync('ROLLBACK');
            throw error;
        }
    
        // 2. Create WorkoutSession entry
        const sessionId = await insertWorkoutSession(db, {
            userId: user.id,
            routineId: workout.routine.id,
            startTime: workout.startTime,
            endTime: workout.endTime,
            notes: workout.notes || null,
        });
    
        // 3. Process each exercise and its sets
        await db.runAsync('BEGIN TRANSACTION');
        try {
            for (const exercise of workout.routine.exercises) {
                // Create SessionExercise entry
                const sessionExerciseId = await insertSessionExercise(db, {
                    sessionId: sessionId,
                    exerciseId: exercise.id,
                });
    
                // Insert all sets
                for (let i = 0; i < exercise.sets.length; i++) {
                    const set = exercise.sets[i];

                    await insertSessionSet(db, {
                        sessionExerciseId: sessionExerciseId,
                        setOrder: i + 1, // Set order starts from 1
                        weight: set.weight,
                        reps: set.reps,
                        restTime: set.restTime || null,
                        completed: true,
                        notes: null,
                    });
                }

                // 4. Update ExerciseSets with most recent data (optional)
                await clearExerciseSets(db, workout.routine.id, exercise.id);

                const routineExercise = await getRoutineExercise(db, workout.routine.id, exercise.id);

                if (routineExercise) {
                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        await insertExerciseSet(db, {
                            routine_exercise_id: routineExercise.id,
                            set_order: i + 1, // Set order starts from 1
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
        refreshRoutines();
    
        return sessionId;
    };

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

    const clearRoutine = () => {
        setRoutine({
            id: 0,
            title: 'Empty Workout',
            exercises: [],
        } as ActiveRoutine);
    }

    const value = {
        routine,
        setRoutine,
        updateRoutine,
        addToRoutine,
        isActiveWorkout,
        setIsActiveWorkout,
        startTime,
        finalTime,
        setFinalTime,
        startWorkout,
        saveWorkoutToDatabase,
        resetRoutine,
        clearRoutine,
    };

    return (
        <ActiveWorkoutContext.Provider value={value}>
            {children}
        </ActiveWorkoutContext.Provider>
    );
};