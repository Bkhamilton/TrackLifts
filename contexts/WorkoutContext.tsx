import { withWorkoutDataLock } from '@/utils/workoutDataLock';
// app/contexts/WorkoutContext.tsx
import { History } from '@/constants/types';
import { getWorkoutFrequencyByUser } from '@/db/data/WorkoutFrequency';
import { clearSessionExercises } from '@/db/workout/SessionExercises';
import { clearSessionSetsByWorkout } from '@/db/workout/SessionSets';
import { deleteWorkoutSession, updateWorkoutSession } from '@/db/workout/WorkoutSessions';
import { insertRecordedExercises, rebuildExerciseRecords, validateWorkoutTimes } from '@/db/workout/recordedWork';
import { notifyWorkoutChanged } from '@/utils/workoutDataEvents';
import { getHistoryData } from '@/utils/historyHelpers';
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

        // dataEvents.dispatchEvent('refreshData');
    }

    const updateWorkout = async (newHistory: History) => withWorkoutDataLock(db, async () => {
        if (!db) return;

        const history = workoutHistory.find(h => h.id === newHistory.id);
        if (!history) throw new Error('Workout history is unavailable.');
        validateWorkoutTimes(newHistory.startTime, newHistory.endTime, newHistory.endTime === history.endTime);
        await db.runAsync('BEGIN TRANSACTION');
        try {
            await updateWorkoutSession(db, {
                id: newHistory.id, userId: user.id, routineId: newHistory.routine.id || null,
                startTime: newHistory.startTime, endTime: newHistory.endTime, notes: newHistory.notes,
            });
            if (JSON.stringify(history.routine) !== JSON.stringify(newHistory.routine)) {
                await clearSessionSetsByWorkout(db, newHistory.id);
                await clearSessionExercises(db, newHistory.id);
                await insertRecordedExercises(db, newHistory.id, newHistory.routine.exercises, null, true);
            }
            await rebuildExerciseRecords(db, user.id);
            await db.runAsync('COMMIT');
        } catch (error) {
            await db.runAsync('ROLLBACK');
            throw error;
        }
        refreshHistory();
        notifyWorkoutChanged();
    });

    const deleteWorkout = async (workout: History) => withWorkoutDataLock(db, async () => {
        if (!db) return;
        await db.runAsync('BEGIN TRANSACTION');
        try {
            await clearSessionSetsByWorkout(db, workout.id);
            await clearSessionExercises(db, workout.id);
            await deleteWorkoutSession(db, workout.id);
            await rebuildExerciseRecords(db, user.id);
            await db.runAsync('COMMIT');
        } catch (error) {
            await db.runAsync('ROLLBACK');
            throw error;
        }
        refreshHistory();
        notifyWorkoutChanged();
    });

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
