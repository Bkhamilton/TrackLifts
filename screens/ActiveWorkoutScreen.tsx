import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import Workout from '@/components/Workout/Workout';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useWorkoutActions } from '@/hooks/useWorkoutActions';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ActiveWorkoutScreen() {
    const [modal, setModal] = useState(false);
    const { routine, startTime, setIsActiveWorkout } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet } = useWorkoutActions();
    const { formattedTime, stopTimer } = useWorkoutTimer(startTime, false);

    const router = useRouter();

    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    // Function to handle stopping the workout
    const stopWorkout = () => {
        stopTimer();
        setIsActiveWorkout(false);
        router.replace('/(tabs)/workout/newWorkout');
    };

    return (
        <View style={styles.container}>
            <Title
                title={routine.title}
                leftContent={<Text>{formattedTime}</Text>}
                rightContent={
                    <TouchableOpacity onPress={stopWorkout} style={styles.endWorkoutButton}>
                        <Text style={styles.title}>DONE</Text>
                    </TouchableOpacity>
                }
            />
            <AddToWorkoutModal
                visible={modal}
                close={closeModal}
                add={addExercise}
            />
            <ScrollView style={styles.scrollView}>
                <Workout
                    routine={routine}
                    open={openModal}
                    onUpdateSet={updateSet}
                    onAddSet={addSet}
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
        marginBottom: 83, // Add space for the button
        width: '100%', // Ensure the ScrollView takes the full width
    },
    endWorkoutButton: {
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});