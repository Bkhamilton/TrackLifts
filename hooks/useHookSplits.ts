import { useState } from 'react';

interface RoutineDay {
    day: number;
    routine: string;
    routine_id?: number;
}

interface Split {
    id: number;
    name: string;
    routines: RoutineDay[];
    isPrimary?: boolean;
}

const sampleSplits: Split[] = [
    {
        id: 1,
        name: 'Weekly Cycle',
        isPrimary: true,
        routines: [
            { day: 1, routine: 'Push' },
            { day: 2, routine: 'Pull' },
            { day: 3, routine: 'Legs' },
            { day: 4, routine: 'Rest' },
            { day: 5, routine: 'Push' },
            { day: 6, routine: 'Pull' },
            { day: 7, routine: 'Legs' }
        ]
    },
    {
        id: 2,
        name: 'Upper/Lower',
        routines: [
            { day: 1, routine: 'Upper' },
            { day: 2, routine: 'Lower' },
            { day: 3, routine: 'Rest' },
            { day: 4, routine: 'Upper' },
            { day: 5, routine: 'Lower' },
            { day: 6, routine: 'Rest' },
            { day: 7, routine: 'Rest' }
        ]
    }
];

export default function useHookSplits() {
    const [splits, setSplits] = useState<Split[]>(sampleSplits);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSplitName, setNewSplitName] = useState('');
    const [editingSplit, setEditingSplit] = useState<Split | null>(null);
    const [currentWeek, setCurrentWeek] = useState<RoutineDay[]>(sampleSplits[0].routines);

    const setAsPrimary = (id: number) => {
        setSplits(prev => prev.map(split => ({
            ...split,
            isPrimary: split.id === id
        })));
        const primarySplit = splits.find(s => s.id === id);
        if (primarySplit) {
            setCurrentWeek(primarySplit.routines);
        }
    };

    const createNewSplit = () => {
        const newSplit: Split = {
            id: splits.length + 1,
            name: newSplitName,
            routines: Array(7).fill(null).map((_, i) => ({
                day: i + 1,
                routine: 'Rest' // Default to rest days
            }))
        };
        setSplits([...splits, newSplit]);
        setNewSplitName('');
        setShowCreateModal(false);
    };

    const updateSplitDay = (splitId: number, day: number, routine: string) => {
        setSplits(prev => prev.map(split => {
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

    return {
        splits,
        currentWeek,
        showCreateModal,
        newSplitName,
        editingSplit,
        setShowCreateModal,
        setNewSplitName,
        setEditingSplit,
        setAsPrimary,
        createNewSplit,
        updateSplitDay,
    };
}
