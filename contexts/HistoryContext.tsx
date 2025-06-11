// app/contexts/BetContext/BetContext.tsx
import { Workout } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useState } from 'react';


interface HistoryContextValue {
    history: Workout[];
    setHistory: React.Dispatch<React.SetStateAction<Workout[]>>;
}

export const HistoryContext = createContext<HistoryContextValue>({
    history: [],
    setHistory: () => {}
});

interface HistoryContextValueProviderProps {
    children: ReactNode;
}

export const HistoryContextProvider = ({ children }: HistoryContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [history, setHistory] = useState<Workout[]>([]);

    const value = {
        history,
        setHistory
    };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};
