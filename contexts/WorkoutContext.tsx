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
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface WorkoutContextValue {
    workoutHistory: History[];
    setWorkoutHistory: React.Dispatch<React.SetStateAction<History[]>>;
    workoutFrequency: { workout_date: string; session_count: number }[];
    frequencyStatus: 'loading' | 'ready' | 'error';
    frequencyError: string | null;
    refreshFrequency: () => Promise<void>;
    refreshHistory: () => Promise<void>;
    updateWorkout: (newHistory: History) => Promise<void>;
    deleteWorkout: (workout: History) => Promise<void>;
}

export const WorkoutContext = createContext<WorkoutContextValue>({
    workoutHistory: [],
    setWorkoutHistory: () => {},
    workoutFrequency: [],
    frequencyStatus: 'loading',
    frequencyError: null,
    refreshFrequency: async () => {},
    refreshHistory: async () => {},
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
    const [frequencyResult, setFrequencyResult] = useState<{
        connection: typeof db;
        userId: number;
        rows: WorkoutContextValue['workoutFrequency'];
        status: WorkoutContextValue['frequencyStatus'];
        error: string | null;
    }>({ connection: null, userId: 0, rows: [], status: 'loading', error: null });
    const isCurrentFrequency = frequencyResult.connection === db && frequencyResult.userId === user.id;
    const workoutFrequency = isCurrentFrequency ? frequencyResult.rows : [];
    const frequencyStatus = isCurrentFrequency ? frequencyResult.status : 'loading';
    const frequencyError = isCurrentFrequency ? frequencyResult.error : null;
    const frequencyRequest = useRef(0);

    const loadFrequency = useCallback(async () => {
        const request = ++frequencyRequest.current;
        if (!db || !user.id) return;
        try {
            const rows = await getWorkoutFrequencyByUser(db, user.id);
            if (request === frequencyRequest.current) {
                setFrequencyResult({ connection: db, userId: user.id, rows, status: 'ready', error: null });
            }
        } catch (error) {
            if (request === frequencyRequest.current) {
                setFrequencyResult({
                    connection: db, userId: user.id, rows: [], status: 'error',
                    error: 'Unable to load workout frequency. Please retry.',
                });
            }
            throw error;
        }
    }, [db, user.id]);

    const refreshFrequency = useCallback(async () => {
        setFrequencyResult({ connection: db, userId: user.id, rows: [], status: 'loading', error: null });
        await loadFrequency();
    }, [db, user.id, loadFrequency]);

    const refreshHistory = useCallback(async () => {
        await Promise.all([
            db && user.id ? getHistoryData(db, user.id).then(historyData => {
                setWorkoutHistory(historyData || []);
            }) : Promise.resolve(),
            refreshFrequency(),
        ]);
    }, [db, user.id, refreshFrequency]);

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
        void refreshHistory().catch(error => console.error('Error refreshing workout history:', error));
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
        void refreshHistory().catch(error => console.error('Error refreshing workout history:', error));
        notifyWorkoutChanged();
    });

    useEffect(() => {
        const requests = frequencyRequest;
        if (db && user.id) {
            void getHistoryData(db, user.id).then(historyData => {
                setWorkoutHistory(historyData || []);
            }).catch(error => console.error('Error loading workout history:', error));
        }
        void loadFrequency().catch(error => console.error('Error loading workout frequency:', error));
        return () => { requests.current++; };
    }, [db, user.id, loadFrequency]);

    const value = {
        workoutHistory,
        setWorkoutHistory,
        workoutFrequency,
        frequencyStatus,
        frequencyError,
        refreshFrequency,
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
