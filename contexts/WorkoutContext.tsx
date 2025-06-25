// app/contexts/WorkoutContext.tsx
import { getWorkoutFrequencyByUser } from '@/db/data/WorkoutFrequency';
import { clearSessionExercises, insertSessionExercise } from '@/db/workout/SessionExercises';
import { clearSessionSets, clearSessionSetsByWorkout, insertSessionSet } from '@/db/workout/SessionSets';
import { deleteWorkoutSession, updateWorkoutSession } from '@/db/workout/WorkoutSessions';
import { dataEvents } from '@/utils/events';
import { areExerciseListsEqual, getHistoryData } from '@/utils/historyHelpers'; // Assuming you have a utility function to fetch history data
import { History } from '@/utils/types';
import { calculateEstimated1RM } from '@/utils/workoutCalculations';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface WorkoutContextValue {
    workoutHistory: History[];
    setWorkoutHistory: React.Dispatch<React.SetStateAction<History[]>>;
    workoutFrequency: any; // Define a more specific type if possible
    setWorkoutFrequency: React.Dispatch<React.SetStateAction<any>>;
    refreshHistory: () => void;
    updateWorkout: (newHistory: History) => Promise<void>;
    deleteWorkout: (workout: History) => Promise<void>;
}

export const WorkoutContext = createContext<WorkoutContextValue>({
    workoutHistory: [],
    setWorkoutHistory: () => {},
    workoutFrequency: null,
    setWorkoutFrequency: () => {},
    refreshHistory: () => {},
    updateWorkout: async () => {
        console.warn('updateWorkout function not implemented');
    },
    deleteWorkout: async () => {
        console.warn('deleteWorkout function not implemented');
    },
});

interface WorkoutContextValueProviderProps {
    children: ReactNode;
}

export const WorkoutContextProvider = ({ children }: WorkoutContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [workoutHistory, setWorkoutHistory] = useState<History[]>([]);
    const [workoutFrequency, setWorkoutFrequency] = useState<any>(null);

    const refreshHistory = () => {
        // This function can be used to refresh the workout history
        if (db && user.id !== 0) {
            getHistoryData(db, user.id).then(historyData => {
                setWorkoutHistory(historyData || []);
            });
            getWorkoutFrequencyByUser(db, user.id).then(frequencyData => {
                setWorkoutFrequency(frequencyData);
            });
        }

        dataEvents.dispatchEvent('refreshData');
    }

    const updateWorkout = async (newHistory: History) => {
        if (!db) return;

        // 1. Update WorkoutSession
        await updateWorkoutSession(db, {
            id: newHistory.id,
            userId: user.id,
            routineId: newHistory.routine.id !== 0 ? newHistory.routine.id : null,
            startTime: newHistory.startTime,
            endTime: newHistory.lengthMin || newHistory.endTime,
            notes: newHistory.notes,
        });

        // 2. If routine changed, update SessionExercises and SessionSets
        const history = workoutHistory.find(h => h.id === newHistory.id);
        if (!history) {
            console.warn('History not found for the given workout ID');
            return;
        }
        if (JSON.stringify(history.routine) !== JSON.stringify(newHistory.routine)) {
            const oldExercises = history.routine.exercises;
            const newExercises = newHistory.routine.exercises;
            const exercisesChanged = !areExerciseListsEqual(oldExercises, newExercises);

            if (exercisesChanged) {
                // Remove old session exercises and sets
                await clearSessionExercises(db, newHistory.id);

                // Insert new session exercises and sets
                for (const exercise of newExercises) {
                    const sessionExerciseId = await insertSessionExercise(db, {
                        sessionId: newHistory.id,
                        exerciseId: exercise.exercise_id ?? exercise.id,
                    });

                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        const estimated1RM = calculateEstimated1RM(set.weight, set.reps);
                        await insertSessionSet(db, {
                            sessionExerciseId,
                            setOrder: i + 1,
                            weight: set.weight,
                            reps: set.reps,
                            estimated1RM,
                            restTime: set.restTime || null,
                            completed: true,
                        });
                    }
                }
            } else {
                // Exercises are the same, only update sets
                // You need to get the sessionExerciseId for each exercise
                for (const exercise of newExercises) {
                    // Find the sessionExerciseId for this exercise in the DB
                    // You may need a helper like getSessionExerciseId(db, sessionId, exerciseId)
                    const sessionExerciseId = await insertSessionExercise(db, {
                        sessionId: newHistory.id,
                        exerciseId: exercise.exercise_id ?? exercise.id,
                        // If your insertSessionExercise is upsert, this works; otherwise, use a get function
                    });

                    // Clear and repopulate sets for this exercise
                    await clearSessionSets(db, sessionExerciseId);

                    for (let i = 0; i < exercise.sets.length; i++) {
                        const set = exercise.sets[i];
                        const estimated1RM = calculateEstimated1RM(set.weight, set.reps);
                        await insertSessionSet(db, {
                            sessionExerciseId,
                            setOrder: i + 1,
                            weight: set.weight,
                            reps: set.reps,
                            estimated1RM,
                            restTime: set.restTime || null,
                            completed: true,
                        });
                    }
                }
            }
        }
        // Optionally, refresh any local state here if needed
        refreshHistory();
    };

    const deleteWorkout = async (workout: History) => {
        if (!db) return;

        // 1. Delete all session sets associated with this workout
        await clearSessionSetsByWorkout(db, workout.id);
        // 2. Delete all session exercises associated with this workout
        await clearSessionExercises(db, workout.id);
        // 3. Delete the workout session
        await deleteWorkoutSession(db, workout.id);

        // Refresh the history after deletion
        refreshHistory();
    }

    useEffect(() => {
        // Initialize or fetch history data from the database if needed
        refreshHistory();
    }, [db, user]);

    const value = {
        workoutHistory,
        setWorkoutHistory,
        workoutFrequency,
        setWorkoutFrequency,
        refreshHistory,
        updateWorkout,
        deleteWorkout,
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};
