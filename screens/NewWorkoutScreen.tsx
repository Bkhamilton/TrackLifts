import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import WorkoutDisplay from '@/components/Workout/NewWorkout/WorkoutDisplay';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useWorkoutActions } from '@/hooks/useWorkoutActions';
import { useRouter } from "expo-router";
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function NewWorkoutScreen() {
    const [modal, setModal] = useState(false);
    const { routine, startWorkout } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet } = useWorkoutActions();

    const router = useRouter();

    const onStartWorkout = () => {
        startWorkout();
        router.push('/(tabs)/workout/activeWorkout');
    }

    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    return (
        <View style={styles.container}>
            <Title 
                title={routine.title}
                rightContent={
                    <TouchableOpacity onPress={onStartWorkout} style={styles.endWorkoutButton}>
                        <Text style={styles.title}>START</Text>
                    </TouchableOpacity>
                }
            />
            <AddToWorkoutModal 
                visible={modal} 
                close={closeModal} 
                add={addExercise}
            />
            <ScrollView style={styles.scrollView}>
                <WorkoutDisplay 
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
        marginBottom: 83, // Add space for the button
        width: '100%', // Ensure the ScrollView takes the full width
        paddingHorizontal: 12,
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
        fontSize: 14,
        fontWeight: 'bold',
    },
    endWorkoutButton: {
        backgroundColor: '#ff8787',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});