import { History } from '@/constants/types';
import { useState } from 'react';

export default function useHookHistory() {

    const [historyModal, setShowHistoryModal] = useState(false)
    const [history, setHistory] = useState<History>({
        id: 0,
        startTime: '',
        lengthMin: '00:00:00',
        endTime: '',
        notes: '',
        routine: {
            id: 0,
            title: '',
            exercises: [],
        },
    });

    function closeHistoryModal() {
        setShowHistoryModal(false)
    }

    function openHistoryModal(history: History) {
        setHistory(history);
        setShowHistoryModal(true);
    }

    return {
        historyModal,
        history,
        closeHistoryModal,
        openHistoryModal,
    };
}
