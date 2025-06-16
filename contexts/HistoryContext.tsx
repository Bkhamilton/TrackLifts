// app/contexts/HistoryContext.tsx
import { History } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useState } from 'react';


interface HistoryContextValue {
    history: History;
    setHistory: React.Dispatch<React.SetStateAction<History>>;
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
        totalWeight: 0
    },
    setHistory: () => {}
});

interface HistoryContextValueProviderProps {
    children: ReactNode;
}

export const HistoryContextProvider = ({ children }: HistoryContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [history, setHistory] = useState<History>({
        id: 0,
        startTime: '',
        routine: {
            id: 0,
            title: '',
            exercises: []
        },
        lengthMin: '',
        notes: '',
        totalWeight: 0
    });

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
