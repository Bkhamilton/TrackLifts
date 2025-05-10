import * as React from 'react';
import { StyleSheet } from 'react-native';

import HistoryInfo from '../components/History/HistoryInfo';
import HistoryModal from '../components/modals/HistoryModal';
import { ScrollView, View } from '../components/Themed';
import Title from '../components/Title';

export default function HistoryScreen() {
    const [showModal, setShowModal] = React.useState(false)
    const [routine, setRoutine] = React.useState({
        id: 1,
        title: "Routine 1",
        exercises: []
    })

    const data = [{
        id: 1,
        date: "03/11/2022",
        routine: {
            id: 1,
            title: "Routine 1",
            exercises: []
        },
        lengthMin: "89",
        totalWeight: 15560,
        workout: []
    },{
        id: 2,
        date: "03/10/2022",
        routine: {
            id: 1,
            title: "Routine 2",
            exercises: []
        },
        lengthMin: "103",
        totalWeight: 14095,
        workout: []
    },{
        id: 3,
        date: "03/08/2022",
        routine: {
            id: 1,
            title: "Routine 3",
            exercises: []
        },
        lengthMin: "73",
        totalWeight: 12006,
        workout: []
    }]

    function closeModal() {
        setShowModal(false)
    }

    function openModal({ routine }: { routine: any }) {
        setRoutine(routine);
        setShowModal(true);
    }

    return (
        <View style={styles.container}>
            <View style={{top:60}}>
                <Title title="History"></Title>
            </View>
            <HistoryModal visible={showModal} close={closeModal} routine={routine}></HistoryModal>
            <ScrollView style={{ top: 60, paddingTop: 10 }}>
                <HistoryInfo open={openModal} data={data}></HistoryInfo> 
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});