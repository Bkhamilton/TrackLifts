// app/contexts/HistoryContext.tsx
import { clearSessionExercises, insertSessionExercise } from '@/db/workout/SessionExercises';
import { clearSessionSets, insertSessionSet } from '@/db/workout/SessionSets';
import { updateWorkoutSession } from '@/db/workout/WorkoutSessions';
import { History } from '@/utils/types';
import { calculateEstimated1RM } from '@/utils/workoutCalculations';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';
import { WorkoutContext } from './WorkoutContext';


interface HistoryContextValue {
    history: History;
    setHistory: React.Dispatch<React.SetStateAction<History>>;
    updateHistory: (newHistory: History) => Promise<void>;
}

export const HistoryContext = createContext<HistoryContextValue>({
    history: {
        id: 0,
        startTime: '',
        routine: {
            id: 0,
            title: '',
            exercises: []
        },
        lengthMin: '',
        notes: '',
    },
    setHistory: () => {},
    updateHistory: async () => {
        console.warn('updateHistory function not implemented');
    },
});

interface HistoryContextValueProviderProps {
    children: ReactNode;
}

export const HistoryContextProvider = ({ children }: HistoryContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);
    const { refreshHistory } = useContext(WorkoutContext);

    const [history, setHistory] = useState<History>({
        id: 0,
        startTime: '',
        routine: {
            id: 0,
            title: '',
            exercises: []
        },
        lengthMin: '',
        notes: ''
    });

    const areExerciseListsEqual = (a: any[], b: any[]) => {
        if (a.length !== b.length) return false;
        const aIds = a.map(e => e.exercise_id ?? e.id).sort();
        const bIds = b.map(e => e.exercise_id ?? e.id).sort();
        return aIds.every((id, idx) => id === bIds[idx]);
    };

    const updateHistory = async (newHistory: History) => {
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

    const value = {
        history,
        setHistory,
        updateHistory,
    };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
