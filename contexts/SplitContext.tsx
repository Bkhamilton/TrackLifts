// app/contexts/SplitContext.tsx
import { getRoutineByTitle } from '@/db/user/Routines';
import { insertSplitRoutine } from '@/db/user/SplitRoutines';
import { insertSplit, setNewActiveSplit } from '@/db/user/Splits';
import { getSplitData } from '@/utils/splitHelpers';
import { Splits } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface SplitContextValue {
    splits: Splits[];
    activeSplit: Splits | null;
    updateActiveSplit: (splitId: number) => void;
    createSplitInDb: (splitObj: Splits) => Promise<number>;
}

export const SplitContext = createContext<SplitContextValue>({
    splits: [],
    activeSplit: null,
    updateActiveSplit: () => {
        return;
    },
    createSplitInDb: async () => {
        return 0;
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

    const createSplitInDb = async (splitObj: Splits): Promise<number> => {
        const splitId = await insertSplit(db, {
            name: splitObj.name,
            user_id: user.id,
            is_active: splitObj.is_active || 0,
        });

        for (const split of splitObj.routines) {
            const routine = await getRoutineByTitle(db, split.routine);
            if (!routine) continue;
            await insertSplitRoutine(db, {
                split_id: splitId,
                split_order: split.day,
                routine_id: routine.id,
            });
        }
        await refreshSplits();

        return splitId;
    };    

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
        createSplitInDb,
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
