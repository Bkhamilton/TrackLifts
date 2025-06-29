import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import HistoryInfo from '@/components/History/HistoryInfo';
import HistoryModal from '@/components/modals/HistoryModal/HistoryModal';
import { View } from '@/components/Themed';
import Title from '@/components/Title';

import { WorkoutContext } from '@/contexts/WorkoutContext';
import useHookHistory from '@/hooks/history/useHookHistory';

export default function HistoryScreen() {
    const {
        historyModal,
        history,
        closeHistoryModal,
        openHistoryModal,        
    } = useHookHistory();

    const { workoutHistory } = useContext(WorkoutContext);

    return (
        <View style={styles.container}>
            <Title 
                title="History"
            />
            <View style={{ paddingTop: 10, width: '100%' }}>
                <HistoryInfo 
                    open={openHistoryModal} 
                    data={workoutHistory}
                /> 
            </View>
            <HistoryModal 
                visible={historyModal} 
                close={closeHistoryModal} 
                history={history}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});