import { withWorkoutDataLock } from '@/utils/workoutDataLock';
// app/contexts/ActiveWorkoutContext.tsx
import { ActiveRoutine, Exercise, Workout } from '@/constants/types';
import { insertRecordedExercises, rebuildExerciseRecords, validateWorkoutTimes } from '@/db/workout/recordedWork';
import { notifyWorkoutChanged } from '@/utils/workoutDataEvents';
import { insertExerciseSet } from '@/db/user/ExerciseSets';
import { clearRoutineExercises, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { insertWorkoutSession } from '@/db/workout/WorkoutSessions';
import { calculateCaloriesBurned } from '@/utils/workoutCalculations';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DBContext } from './DBContext';
import { RoutineContext } from './RoutineContext';
import { UserContext } from './UserContext';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: ActiveRoutine;
    setRoutine: React.Dispatch<React.SetStateAction<ActiveRoutine>>;
    trySetRoutineForNewWorkout: (routine: ActiveRoutine) => boolean;
    updateRoutine: (routine: ActiveRoutine) => void;
    addToRoutine: (exercise: Exercise) => void;
    replaceExercise: (exerciseIndex: number, newExercise: Exercise) => void;
    isActiveWorkout: boolean;
    setIsActiveWorkout: React.Dispatch<React.SetStateAction<boolean>>;
    startTime: number | null;
    startTimeStr: string | null;
    finalTime: string | null;
    setFinalTime: React.Dispatch<React.SetStateAction<string | null>>;
    startWorkout: () => void;
    finalWorkout: Workout;
    setFinalWorkout: React.Dispatch<React.SetStateAction<Workout>>;
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
    trySetRoutineForNewWorkout: () => false,
    updateRoutine: () => {},
    addToRoutine: () => {},
    replaceExercise: () => {},
    isActiveWorkout: false,
    setIsActiveWorkout: () => {},
    startTime: null,
    startTimeStr: null,
    finalTime: null,
    setFinalTime: () => {},
    startWorkout: () => {},
    finalWorkout: {
        startTime: null,
        endTime: null,
        notes: '',
        lengthMin: '',
        routine: {
            id: 0,
            title: 'Empty Workout',
            exercises: [],
        },
    } as Workout, // Initialize with a default Workout object
    setFinalWorkout: () => {},
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
    const { db } = useContext(DBContext);
    const { user, userStats } = useContext(UserContext);
    const { routines, refreshRoutines } = useContext(RoutineContext);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [startTimeStr, setStartTimeStr] = useState<string | null>(null);
    const [finalTime, setFinalTime] = useState<string | null>(null);

    const [routine, setRoutine] = useState<ActiveRoutine>({
        id: 0,
        title: 'Empty Workout',
        exercises: [],
    } as ActiveRoutine);
    const [finalWorkout, setFinalWorkout] = useState<Workout>({
        startTime: null,
        endTime: null,
        lengthMin: '',
        notes: '',
        routine: {
            id: 0,
            title: 'Empty Workout',
            exercises: [],
        },
    } as Workout);

    const [isActiveWorkout, setIsActiveWorkout] = useState(false);

    const trySetRoutineForNewWorkout = (newRoutine: ActiveRoutine) => {
        if (isActiveWorkout) return false;

        setRoutine(newRoutine);
        return true;
    };

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

    const replaceExercise = (exerciseIndex: number, newExercise: Exercise) => {
        const exerciseWithSets = {
            ...newExercise,
            sets: [
                {
                    id: Date.now(),
                    reps: 10,
                    weight: 0,
                    restTime: 60,
                    set_order: 1,
                },
            ],
        };

        setRoutine((prevRoutine) => ({
            ...prevRoutine,
            exercises: prevRoutine.exercises.map((exercise, idx) =>
                idx === exerciseIndex ? exerciseWithSets : exercise
            ),
        }));
    };

    const startWorkout = () => {
        setRoutine(prev => ({ ...prev, exercises: prev.exercises.map(ex => ({ ...ex, sets: ex.sets.map(set => ({ ...set, completed: false, rir: null, is_warmup: null })) })) }));
        setIsActiveWorkout(true);
        const now = new Date();
        setStartTime(now.getTime());
        setStartTimeStr(now.toISOString());
    };

    const saveWorkoutToDatabase = async (workout: Workout) => withWorkoutDataLock(db, async () => {
        if (!db || !user.id) throw new Error('Workout database is not ready.');
        validateWorkoutTimes(workout.startTime, workout.endTime);
        if (!workout.routine.exercises.some(ex => ex.sets.some(s => s.completed === true || s.completed === 1))) {
            throw new Error('Mark at least one performed set complete before saving.');
        }
        const mass = Number(userStats?.weight);
        const bodyMass = Number.isFinite(mass) && mass > 0 ? mass : null;
        const durationMinutes = (Date.parse(workout.endTime!) - Date.parse(workout.startTime!)) / 60000;
        let sessionId: number;
        await db.runAsync('BEGIN TRANSACTION');
        try {
            sessionId = await insertWorkoutSession(db, {
                userId: user.id, routineId: workout.routine.id || null,
                startTime: workout.startTime, endTime: workout.endTime,
                notes: workout.notes || null,
                caloriesBurned: bodyMass === null ? null : calculateCaloriesBurned({ weightLbs: bodyMass, durationMinutes }),
            });
            await insertRecordedExercises(db, sessionId, workout.routine.exercises, bodyMass);
            if (workout.routine.id) {
                await db.runAsync('DELETE FROM ExerciseSets WHERE routine_exercise_id IN (SELECT id FROM RoutineExercises WHERE routine_id = ?)', [workout.routine.id]);
                await clearRoutineExercises(db, workout.routine.id);
                for (const exercise of workout.routine.exercises) {
                    const exerciseId = exercise.exercise_id ?? exercise.id;
                    const routineExerciseId = await insertRoutineExercise(db, { routine_id: workout.routine.id, exercise_id: exerciseId });
                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        await insertExerciseSet(db, {
                            routine_exercise_id: routineExerciseId, set_order: i + 1,
                            weight: set.weight, reps: set.reps, date: workout.endTime,
                        });
                    }
                }
            }
            await rebuildExerciseRecords(db, user.id);
            await db.runAsync('COMMIT');
        } catch (error) {
            await db.runAsync('ROLLBACK');
            throw error;
        }
        refreshRoutines();
        notifyWorkoutChanged();
        return sessionId;
    });

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
        trySetRoutineForNewWorkout,
        updateRoutine,
        addToRoutine,
        replaceExercise,
        isActiveWorkout,
        setIsActiveWorkout,
        startTime,
        startTimeStr,
        finalTime,
        setFinalTime,
        startWorkout,
        finalWorkout,
        setFinalWorkout,
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
