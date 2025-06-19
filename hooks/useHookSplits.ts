import { SplitContext } from '@/contexts/SplitContext';
import { Splits } from '@/utils/types';
import { useContext, useState } from 'react';

interface RoutineDay {
    day: number;
    routine: string;
    routine_id?: number;
}

export default function useHookSplits() {
    const { splits, activeSplit, updateActiveSplit } = useContext(SplitContext);
    const [dislpaySplits, setDisplaySplits] = useState<Splits[]>(splits);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSplitName, setNewSplitName] = useState('');
    const [editingSplit, setEditingSplit] = useState<Splits | null>(null);
    const [editingSplitId, setEditingSplitId] = useState<number | null>(null);
    const [currentWeek, setCurrentWeek] = useState<RoutineDay[]>(activeSplit?.routines || []);
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
            setCurrentWeek(primarySplit.routines);
        }
    };

    const createNewSplit = () => {
        const newSplit: Splits = {
            id: dislpaySplits.length + 1,
            name: newSplitName,
            routines: [
                {
                    day: 1, routine: 'Rest',
                    id: 0,
                    split_id: 0,
                    routine_id: 0
                } // Start with just one day by default
            ],
            is_active: false
        };
        setDisplaySplits([...dislpaySplits, newSplit]);
        setNewSplitName('');
        setShowCreateModal(false);
    };

    const updateSplitDay = (splitId: number, day: number, routine: string) => {
        setDisplaySplits(prev => prev.map(split => {
            if (split.id === splitId) {
                return {
                    ...split,
                    routines: split.routines.map(d => 
                        d.day === day ? { ...d, routine } : d
                    )
                };
            }
            return split;
        }));
    };

    const addDayToSplit = (splitId: number) => {
        setDisplaySplits(prev => prev.map(split => {
            if (split.id === splitId) {
                const newDayNumber = split.routines.length > 0 
                    ? Math.max(...split.routines.map(d => d.day)) + 1 
                    : 1;
                return {
                    ...split,
                    routines: [
                        ...split.routines,
                        {
                            day: newDayNumber,
                            routine: 'Rest',
                            id: Date.now(), // or another unique id generator
                            split_id: splitId,
                            routine_id: 0
                        }
                    ]
                };
            }
            return split;
        }));
    };

    const removeDayFromSplit = (splitId: number, dayNumber: number) => {
        setDisplaySplits(prev => prev.map(split => {
            if (split.id === splitId) {
                const newRoutines = split.routines.filter(d => d.day !== dayNumber);
                
                // If this is the primary split, update currentWeek
                if (split.is_active) {
                    setCurrentSplit({
                        ...split,
                        routines: newRoutines
                    });
                    setCurrentWeek(newRoutines);
                }
                
                return {
                    ...split,
                    routines: newRoutines
                };
            }
            return split;
        }));
    };

    const createSplit = (name: string, routines: RoutineDay[]) => {
        const newSplit: Splits = {
            id: dislpaySplits.length + 1,
            name,
            routines: routines.map((r, i) => ({
                ...r,
                id: Date.now() + i,
                split_id: dislpaySplits.length + 1,
                routine_id: 0
            })),
            is_active: false
        };
        setDisplaySplits([...dislpaySplits, newSplit]);
        // add call to createSplitInDB
        setShowCreateModal(false);
    };

    return {
        dislpaySplits,
        setDisplaySplits,
        activeSplit,
        currentWeek,
        currentSplit,
        showCreateModal,
        newSplitName,
        editingSplit,
        editingSplitId,
        setEditingSplitId,
        setShowCreateModal,
        setNewSplitName,
        setEditingSplit,
        setAsPrimary,
        createNewSplit,
        updateSplitDay,
        addDayToSplit,
        removeDayFromSplit,
        createSplit
    };
}