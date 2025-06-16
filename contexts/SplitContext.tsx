// app/contexts/SplitContext.tsx
import { getSplitData } from '@/utils/splitHelpers';
import { Splits } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';

interface SplitContextValue {
    splits: Splits[];
    activeSplit: Splits | null;
}

export const SplitContext = createContext<SplitContextValue>({
    splits: [],
    activeSplit: null,
});

interface SplitContextValueProviderProps {
    children: ReactNode;
}

export const SplitContextProvider = ({ children }: SplitContextValueProviderProps) => {

    const { db, user } = useContext(DBContext);

    const [splits, setSplits] = useState<Splits[]>([]);
    const [activeSplit, setActiveSplit] = useState<Splits | null>(null);

    useEffect(() => {
        if (db && user.id !== 0) {
            const fetchSplits = async () => {
                const data = await getSplitData(db, user.id);
                setSplits(data || []);
                for (const split of data || []) {
                    if (split.is_active) {
                        setActiveSplit(split);
                        break;
                    }
                }
            }

            fetchSplits();
        }
    }, [db, user]);

    const value = {
        splits,
        activeSplit,
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
