// app/contexts/ActiveWorkoutContext.tsx
import { ActiveRoutine, Exercise, Workout } from '@/constants/types';
import { updateMuscleSoreness } from '@/db/data/MuscleGroupSoreness';
import { clearExerciseSets, insertExerciseSet } from '@/db/user/ExerciseSets';
import { clearRoutineExercises, getRoutineExercise, insertRoutineExercise } from '@/db/user/RoutineExercises';
import { getPreviousMax1RM, insertExerciseMaxHistory } from '@/db/workout/ExerciseMaxHistory';
import { insertSessionExercise } from '@/db/workout/SessionExercises';
import { insertSessionSet } from '@/db/workout/SessionSets';
import { insertWorkoutSession } from '@/db/workout/WorkoutSessions';
import { calculateCaloriesBurned, calculateEstimated1RM } from '@/utils/workoutCalculations';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DBContext } from './DBContext';
import { RoutineContext } from './RoutineContext';
import { UserContext } from './UserContext';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: ActiveRoutine;
    setRoutine: React.Dispatch<React.SetStateAction<ActiveRoutine>>;
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
        setIsActiveWorkout(true);
        const now = new Date();
        setStartTime(now.getTime());
        setStartTimeStr(now.toISOString());
    };

    const saveWorkoutToDatabase = async (workout: Workout) => {
        // Only update RoutineExercises if routineId is valid (not 0)
        if (workout.routine.id && workout.routine.id !== 0) {
            if (workout.routine.exercises.some(ex => ex.exercise_id === undefined)) {
                try {
                    await db.runAsync('BEGIN TRANSACTION');
                    await clearRoutineExercises(db, workout.routine.id);
                    for (const exercise of workout.routine.exercises) {
                        exercise.exercise_id ?
                            await insertRoutineExercise(db, {
                                routine_id: workout.routine.id,
                                exercise_id: exercise.exercise_id
                            }) :
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
            }
        }

        // Calculate duration in minutes
        const start = new Date(workout.startTime!);
        const end = new Date(workout.endTime || Date.now());
        const durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

        // Get user weight in lbs (fallback to 180lbs if unknown)
        const weightLbs = userStats?.weight
            ? parseFloat(userStats.weight)
            : 180;

        // Calculate calories burned
        const caloriesBurned = calculateCaloriesBurned({
            weightLbs,
            durationMinutes,
            met: 4.5, // or adjust based on intensity
        });        

        // Insert WorkoutSession (allow routineId to be 0 or null for ad-hoc workouts)
        const sessionId = await insertWorkoutSession(db, {
            userId: user.id,
            routineId: workout.routine.id !== 0 ? workout.routine.id : null, // or 0 if your schema requires
            startTime: workout.startTime,
            endTime: workout.endTime,
            notes: workout.notes || null,
            caloriesBurned,
        });

        // Insert session exercises and sets as usual
        await db.runAsync('BEGIN TRANSACTION');
        try {
            for (const exercise of workout.routine.exercises) {
                const sessionExerciseId = exercise.exercise_id ?
                    await insertSessionExercise(db, {
                        sessionId: sessionId,
                        exerciseId: exercise.exercise_id,
                    }) :
                    await insertSessionExercise(db, {
                        sessionId: sessionId,
                        exerciseId: exercise.id,
                    }); 

                // Calculate max 1RM for this exercise in this session
                let max1RM = 0;
                for (const set of exercise.sets) {
                    let est1RM;
                    // If bodyweight exercise (weight is 0 or undefined)
                    if (exercise.equipment == 'Bodyweight' || set.weight <= 0) {
                        est1RM = calculateEstimated1RM(userStats.weight || 150, 1); // fallback to 150lbs if unknown
                    } else {
                        est1RM = calculateEstimated1RM(set.weight, set.reps);
                    }
                    if (est1RM > max1RM) max1RM = est1RM;
                }

                // Get previous max 1RM from ExerciseMaxHistory
                const exerciseId = exercise.exercise_id || exercise.id;
                const prevMax1RM = await getPreviousMax1RM(db, user.id, exerciseId);

                // If new max1RM is greater, insert into ExerciseMaxHistory
                if (max1RM > prevMax1RM) {
                    await insertExerciseMaxHistory(db, {
                        user_id: user.id,
                        exercise_id: exerciseId,
                        one_rep_max: max1RM,
                        calculation_date: workout.endTime || new Date().toISOString(),
                    });
                }

                for (let i = 0; i < exercise.sets.length; i++) {
                    const set = exercise.sets[i];
                    const estimated1RM = calculateEstimated1RM(set.weight, set.reps);
                    await insertSessionSet(db, {
                        sessionExerciseId: sessionExerciseId,
                        setOrder: i + 1,
                        weight: set.weight,
                        reps: set.reps,
                        estimated1RM: estimated1RM,
                        restTime: set.restTime || null,
                        completed: true,
                    });
                }

                // Only update ExerciseSets if routineId is valid
                if (workout.routine.id && workout.routine.id !== 0) {
                    exercise.exercise_id ?
                        await clearExerciseSets(db, workout.routine.id, exercise.exercise_id) :
                        await clearExerciseSets(db, workout.routine.id, exercise.id);

                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        await insertExerciseSet(db, {
                            routine_exercise_id: exercise.exercise_id
                                ? (await getRoutineExercise(db, workout.routine.id, exercise.exercise_id))?.id
                                : (await getRoutineExercise(db, workout.routine.id, exercise.id))?.id,
                            set_order: i + 1,
                            weight: set.weight,
                            reps: set.reps,
                            date: new Date().toISOString(),
                        });
                    }
                }

                await updateMuscleSoreness(db, user.id);
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