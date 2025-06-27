import { SplitContext } from '@/contexts/SplitContext';
import { Splits } from '@/utils/types';
import { useContext, useState } from 'react';

interface RoutineDay {
    day: number;
    routine: string;
    routine_id?: number;
}

export default function useHookSplits() {
    const { splits, activeSplit, updateActiveSplit, createSplitInDb } = useContext(SplitContext);
    const [dislpaySplits, setDisplaySplits] = useState<Splits[]>(splits);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSplitId, setEditingSplitId] = useState<number | null>(null);
    const [currentSplit, setCurrentSplit] = useState<Splits | null>(activeSplit || null);

    const setAsPrimary = (id: number) => {
        updateActiveSplit(id);
        setDisplaySplits(prev => prev.map(split => ({
            ...split,
            is_active: split.id === id
        })));
        const primarySplit = dislpaySplits.find(s => s.id === id);
        if (primarySplit) {
            setCurrentSplit(primarySplit);
        }
    };

    const createSplit = async (name: string, routines: RoutineDay[]) => {
        const newSplit: Splits = {
            id: dislpaySplits.length + 1,
            name,
            routines: routines.map((r, i) => ({
                ...r,
                id: Date.now() + i,
                split_id: dislpaySplits.length + 1,
                routine_id: r.routine_id || 0
            })),
            is_active: false
        };
        await createSplitInDb(newSplit);
        setDisplaySplits([...dislpaySplits, newSplit]);
        // add call to createSplitInDB
        setShowCreateModal(false);
    };

    return {
        dislpaySplits,
        setDisplaySplits,
        activeSplit,
        currentSplit,
        setCurrentSplit,
        showCreateModal,
        editingSplitId,
        setEditingSplitId,
        setShowCreateModal,
        setAsPrimary,
        createSplit
    };
}