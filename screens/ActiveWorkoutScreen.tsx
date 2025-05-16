import Workout from '@/components/NewWorkout/Workout';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function NewWorkoutScreen() {
    const [modal, setModal] = useState(false);

    const { exercises } = useContext(DBContext);
    const { routine, addToRoutine, startTime } = useContext(ActiveWorkoutContext);

    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    const addToWorkout = (exercise: Exercise) => {
        addToRoutine(exercise);
        closeModal();
    }

    // function to format time elapsed from startTime to Date.now() into a HH:MM:SS format
    const formatTime = (startTime: number) => {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <View style={styles.container}>
            <Title 
                title={routine.title}
                rightContent={
                    <Text>{formatTime(startTime)}</Text>
                }
            />
            <AddToWorkoutModal 
                visible={modal} 
                close={closeModal} 
                add={addToWorkout} 
                exercises={exercises}
            />
            <ScrollView style={styles.scrollView}>
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
    scrollView: {
        flex: 1, // Allow the ScrollView to take up available space
        marginBottom: 80, // Add space for the button
    },
    startWorkoutButton: {
        position: 'absolute',
        bottom: 100, // Position the button above the tab bar
        backgroundColor: '#ff8787',
        borderRadius: 50,
        padding: 12,
        paddingHorizontal: 48,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});