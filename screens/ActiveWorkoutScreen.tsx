import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import Workout from '@/components/NewWorkout/Workout';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ActiveWorkoutScreen() {
    const [modal, setModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(Date.now()); // State to track the current time
    const [isWorkoutStopped, setIsWorkoutStopped] = useState(false); // Track if the workout is stopped
    const [stoppedTime, setStoppedTime] = useState<number | null>(null); // Store the time when the workout is stopped

    const { exercises } = useContext(DBContext);
    const { routine, addToRoutine, startTime, setIsActiveWorkout } = useContext(ActiveWorkoutContext);

    const router = useRouter();

    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    const addToWorkout = (exercise: Exercise) => {
        addToRoutine(exercise);
        closeModal();
    };

    // Function to format time elapsed from startTime to currentTime into HH:MM:SS format
    const formatTime = (startTime: number | null) => {
        if (!startTime) return '00:00:00'; // Return default value if startTime is not set

        const elapsed = (isWorkoutStopped && stoppedTime !== null)
            ? stoppedTime - startTime // Use stoppedTime if the workout is stopped
            : currentTime - startTime; // Otherwise, use currentTime

        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // useEffect to update the currentTime every second
    useEffect(() => {
        if (isWorkoutStopped) return; // Stop updating if the workout is stopped

        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [isWorkoutStopped]);

    // Function to handle stopping the workout
    const stopWorkout = () => {
        setIsWorkoutStopped(true); // Mark the workout as stopped
        setIsActiveWorkout(false); // Update the context to indicate no active workout
        router.replace('/(tabs)/workout/newWorkout');
        setStoppedTime(Date.now()); // Store the time when the workout was stopped
    };

    return (
        <View style={styles.container}>
            <Title
                title={routine.title}
                leftContent={<Text>{formatTime(startTime)}</Text>}
                rightContent={
                    <TouchableOpacity onPress={stopWorkout} style={styles.endWorkoutButton}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>DONE</Text>
                    </TouchableOpacity>
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
    endWorkoutButton: {
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});