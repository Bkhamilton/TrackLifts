import * as React from 'react';
import { StyleSheet } from 'react-native';

import HistoryInfo from '@/components/History/HistoryInfo';
import HistoryModal from '@/components/modals/HistoryModal';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';

import exampleHistory from '@/data/ExampleHistory.json';

export default function HistoryScreen() {
    const [showModal, setShowModal] = React.useState(false)
    const [history, setHistory] = React.useState(exampleHistory[0]);

    function closeModal() {
        setShowModal(false)
    }

    function openModal(history: any) {
        setHistory(history);
        setShowModal(true);
    }

    return (
        <View style={styles.container}>
            <Title 
                title="History"
            />
            <ScrollView style={{ paddingTop: 10, width: '100%' }}>
                <HistoryInfo 
                    open={openModal} 
                    data={exampleHistory}
                /> 
            </ScrollView>
            <HistoryModal 
                visible={showModal} 
                close={closeModal} 
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