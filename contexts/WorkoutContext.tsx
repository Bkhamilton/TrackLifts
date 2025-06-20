// app/contexts/WorkoutContext.tsx
import { getHistoryData } from '@/utils/historyHelpers'; // Assuming you have a utility function to fetch history data
import { History } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface WorkoutContextValue {
    workoutHistory: History[];
    setWorkoutHistory: React.Dispatch<React.SetStateAction<History[]>>;
}

export const WorkoutContext = createContext<WorkoutContextValue>({
    workoutHistory: [],
    setWorkoutHistory: () => {}
});

interface WorkoutContextValueProviderProps {
    children: ReactNode;
}

export const WorkoutContextProvider = ({ children }: WorkoutContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [workoutHistory, setWorkoutHistory] = useState<History[]>([]);

    const value = {
        workoutHistory,
        setWorkoutHistory
    };

    useEffect(() => {
        // Initialize or fetch history data from the database if needed
        const fetchHistory = async () => {
            if (db && user.id !== 0) {
                const historyData = await getHistoryData(db, user.id);
                setWorkoutHistory(historyData || []);
            }
        };
        fetchHistory();
    }, [db, user]);

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};
