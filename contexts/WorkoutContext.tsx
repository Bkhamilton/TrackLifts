// app/contexts/WorkoutContext.tsx
import { getWorkoutFrequencyByUser } from '@/db/data/WorkoutFrequency';
import { getHistoryData } from '@/utils/historyHelpers'; // Assuming you have a utility function to fetch history data
import { History } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface WorkoutContextValue {
    workoutHistory: History[];
    setWorkoutHistory: React.Dispatch<React.SetStateAction<History[]>>;
    refreshHistory: () => void;
}

export const WorkoutContext = createContext<WorkoutContextValue>({
    workoutHistory: [],
    setWorkoutHistory: () => {},
    refreshHistory: () => {}
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
        }
    }

    useEffect(() => {
        // Initialize or fetch history data from the database if needed
        const fetchHistory = async () => {
            if (db && user.id !== 0) {
                const historyData = await getHistoryData(db, user.id);
                setWorkoutHistory(historyData || []);
            }
        };
        // Fetch workout frequency data
        const fetchWorkoutFrequency = async () => {
            if (db && user.id !== 0) {
                const frequencyData = await getWorkoutFrequencyByUser(db, user.id);
                setWorkoutFrequency(frequencyData);
            }
        }
        fetchHistory();
        fetchWorkoutFrequency();
    }, [db, user]);

    const value = {
        workoutHistory,
        setWorkoutHistory,
        refreshHistory
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};
