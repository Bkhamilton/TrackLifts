// app/contexts/DataContext.tsx
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface DataContextValue {
    favoriteRoutines: any[]; // Replace 'any' with your specific type if available
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
});

interface DataContextValueProviderProps {
    children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [favoriteRoutines, setFavoriteRoutines] = useState<any[]>([]);

    useEffect(() => {
        if (db && user.id !== 0) {
            getFavoriteRoutinesByUser(db, user.id).then((routines) => {
                console.log('Favorite routines:', JSON.stringify(routines, null, 2));
                setFavoriteRoutines(routines);
            });
        }
    }, [db, user]);

    const value = {
        favoriteRoutines,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
