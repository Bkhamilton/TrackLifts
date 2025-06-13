// app/contexts/BetContext/BetContext.tsx
import { ActiveRoutine } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode } from 'react';

interface HomeContextValue {
    routineToEdit: ActiveRoutine;
    setRoutineToEdit: React.Dispatch<React.SetStateAction<ActiveRoutine>>;
}

export const HomeContext = createContext<HomeContextValue>({
    routineToEdit: {
        id: 0,
        title: 'Temp Routine',
        exercises: []
    },
    setRoutineToEdit: () => {}
});

interface HomeContextValueProviderProps {
    children: ReactNode;
}

export const HomeContextProvider = ({ children }: HomeContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [routineToEdit, setRoutineToEdit] = React.useState<ActiveRoutine>({
        id: 0,
        title: 'Temp Routine',
        exercises: []
    });

    const value = {
        routineToEdit,
        setRoutineToEdit
    };

    return (
        <HomeContext.Provider value={value}>
            {children}
        </HomeContext.Provider>
    );
};
