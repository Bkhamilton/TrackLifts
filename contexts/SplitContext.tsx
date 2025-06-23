// app/contexts/SplitContext.tsx
import { addFavoriteRoutine, getFavoriteRoutineIds, removeFavoriteRoutine } from '@/db/user/RoutineFavorites';
import { getCurrentSplitDayIndex, insertSplitCompletion } from '@/db/user/SplitCompletions';
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
    getCurrentSplitDay: () => Promise<number>;
    getRecommendedRoutine: () => Promise<{ routine: any | null, isRestDay: boolean }>;
    completeCurrentSplitDay: () => Promise<void>;
    isRoutineFavorite: (routineId: number) => Promise<boolean>;
    toggleFavoriteRoutine: (routineId: number) => Promise<void>;    
    refreshSplits: () => Promise<void>;
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
    getCurrentSplitDay: async () => {
        return 0;
    },
    getRecommendedRoutine: async () => {
        return { routine: null, isRestDay: false };
    },
    completeCurrentSplitDay: async () => {
        return;
    },
    isRoutineFavorite: async () => false,
    toggleFavoriteRoutine: async () => {},    
    refreshSplits: async () => {
        return;
    }
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

        // Get the current day index in the split cycle (0-based)
    const getCurrentSplitDay = async (): Promise<number> => {
        if (!db || !user?.id || !activeSplit) return 0;
        const dayIndex = await getCurrentSplitDayIndex(db, user.id, activeSplit.id);
        // Wrap around if user has completed more days than the split length
        const splitLength = activeSplit.routines.length;
        return splitLength > 0 ? dayIndex % splitLength : 0;
    };

    // Recommend the next routine or rest day
    const getRecommendedRoutine = async (): Promise<{ routine: any | null, isRestDay: boolean }> => {
        if (!activeSplit) return { routine: null, isRestDay: false };
        const dayIndex = await getCurrentSplitDay();
        const routines = activeSplit.routines.sort((a, b) => a.day - b.day);
        const today = routines[dayIndex];
        if (!today || !today.routine_id) {
            // No routine assigned for this day = rest day
            return { routine: null, isRestDay: true };
        }
        return { routine: today, isRestDay: false };
    };

    // Mark the current day as completed
    const completeCurrentSplitDay = async (): Promise<void> => {
        if (!db || !user?.id || !activeSplit) return;
        await insertSplitCompletion(db, {
            user_id: user.id,
            split_id: activeSplit.id,
            completion_date: new Date().toISOString(),
            completed_cycles: 1,
        });
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
        getCurrentSplitDay,
        getRecommendedRoutine,
        completeCurrentSplitDay,
        isRoutineFavorite,
        toggleFavoriteRoutine,
        refreshSplits
    };

    return (
        <SplitContext.Provider value={value}>
            {children}
        </SplitContext.Provider>
    );
};
