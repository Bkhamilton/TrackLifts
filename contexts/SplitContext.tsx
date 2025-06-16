// app/contexts/SplitContext.tsx
import { setNewActiveSplit } from '@/db/user/Splits';
import { getSplitData } from '@/utils/splitHelpers';
import { Splits } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface SplitContextValue {
    splits: Splits[];
    activeSplit: Splits | null;
    updateActiveSplit: (splitId: number) => void;
}

export const SplitContext = createContext<SplitContextValue>({
    splits: [],
    activeSplit: null,
    updateActiveSplit: () => {
        return;
    },
});

interface SplitContextValueProviderProps {
    children: ReactNode;
}

export const SplitContextProvider = ({ children }: SplitContextValueProviderProps) => {

    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [splits, setSplits] = useState<Splits[]>([]);
    const [activeSplit, setActiveSplit] = useState<Splits | null>(null);

    const updateActiveSplit = async (splitId: number) => {
        if (db && user.id !== 0) {
            await setNewActiveSplit(db, user.id, splitId);
        }
        await refreshSplits();
    }

    const refreshSplits = async () => {
        if (db && user.id !== 0) {
            const data = await getSplitData(db, user.id);
            setSplits(data || []);
            for (const split of data || []) {
                if (split.is_active) {
                    setActiveSplit(split);
                    break;
                }
            }
        }
    }

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
        updateActiveSplit,
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
