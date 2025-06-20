// app/contexts/SplitContext.tsx
import { addFavoriteRoutine, getFavoriteRoutineIds, removeFavoriteRoutine } from '@/db/user/RoutineFavorites';
import { clearSplitRoutines, insertSplitRoutine } from '@/db/user/SplitRoutines';
import { clearSplit, insertSplit, setNewActiveSplit, updateSplit } from '@/db/user/Splits';
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
    updateSplitInDB: (splitObj: Splits) => Promise<void>;
    deleteSplitInDB: (splitId: number) => Promise<void>;
    isRoutineFavorite: (routineId: number) => Promise<boolean>;
    toggleFavoriteRoutine: (routineId: number) => Promise<void>;    
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
    updateSplitInDB: async () => {
        return;
    },
    deleteSplitInDB: async () => {
        return;
    },
    isRoutineFavorite: async () => false,
    toggleFavoriteRoutine: async () => {},    
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
            await insertSplitRoutine(db, {
                split_id: splitId,
                split_order: split.day,
                routine_id: split.routine_id,
            });
        }
        await refreshSplits();

        return splitId;
    };   
    
    const updateSplitInDB = async (splitObj: Splits): Promise<void> => {
        if (!db || user.id === 0) return;

        // If name has changed, update the split name
        const existingSplit = splits.find(s => s.id === splitObj.id);
        if (existingSplit && existingSplit.name !== splitObj.name) {
            await updateSplit(db, {
                id: splitObj.id,
                name: splitObj.name,
                user_id: splitObj.user_id || user.id,
            });
        }

        // Clear existing split routines
        await clearSplitRoutines(db, splitObj.id);

        // Insert new routines
        for (const split of splitObj.routines) {
            await insertSplitRoutine(db, {
                split_id: splitObj.id,
                split_order: split.day,
                routine_id: split.routine_id,
            });
        }
        
        await refreshSplits();
    }

    const deleteSplitInDB = async (splitId: number): Promise<void> => {
        if (!db || user.id === 0) return;

        // Clear routines associated with the split
        await clearSplitRoutines(db, splitId);

        // Delete the split itself
        await clearSplit(db, user.id, splitId);

        // Refresh splits after deletion
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

    const isRoutineFavorite = async (routineId: number): Promise<boolean> => {
        if (!db || !user?.id) return false;
        const ids = await getFavoriteRoutineIds(db, user.id);
        return ids.includes(routineId);
    };

    const toggleFavoriteRoutine = async (routineId: number) => {
        if (!db || !user?.id) return;
        const favorite = await isRoutineFavorite(routineId);
        if (favorite) {
            await removeFavoriteRoutine(db, user.id, routineId);
        } else {
            await addFavoriteRoutine(db, user.id, routineId);
        }
    };

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
        updateSplitInDB,
        deleteSplitInDB,
        isRoutineFavorite,
        toggleFavoriteRoutine,
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
