import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

import Workout from '@/components/NewWorkout/Workout';
import Title from '@/components/Title';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';

import { Exercise } from '@/utils/types';
import { ScrollView, View } from '../components/Themed';

export default function NewWorkoutScreen() {
    const [modal, setModal] = useState(false);

    const { exercises } = useContext(DBContext);
    const { routine } = useContext(RoutineContext);

    function openModal(){
        setModal(true)
    }

    function closeModal(){
        setModal(false)
    }

    function addToWorkout(props: Exercise) {
        setModal(false)
    }

    return (
        <View style={styles.container}>
            <View style={{top:60}}>
                <Title title={routine.title}></Title>
            </View>
            <AddToWorkoutModal 
                visible={modal} 
                close={closeModal} 
                add={addToWorkout} 
                exercises={exercises}
            />
            <ScrollView style={{ top:60, paddingTop: 10 }}>
                <Workout 
                    routine={routine} 
                    open={openModal}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: '90%',
    },
});
