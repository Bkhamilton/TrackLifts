import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import WorkoutDisplay from '@/components/Workout/NewWorkout/WorkoutDisplay';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import OptionsModal from '@/components/modals/OptionsModal';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useWorkoutActions } from '@/hooks/useWorkoutActions';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function NewWorkoutScreen() {
    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [optionsModal, setOptionsModal] = useState(false);
    const { routine, startWorkout } = useContext(ActiveWorkoutContext);
    const { addExercise, updateSet, addSet } = useWorkoutActions();

    const router = useRouter();

    const onStartWorkout = () => {
        startWorkout();
        router.push('/(tabs)/workout/activeWorkout');
    }

    const openModal = () => {
        setAddWorkoutModal(true);
    }
    const closeModal = () => {
        setAddWorkoutModal(false);
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
                leftContent={
                    routine.title !== 'Empty Workout' ? (
                        <TouchableOpacity 
                            onPress={() => setOptionsModal(true)}
                        >
                            <SimpleLineIcons name="options" size={20} color="#ff8787" />
                        </TouchableOpacity>
                    ) : null
                }
            />
            <AddToWorkoutModal 
                visible={addWorkoutModal} 
                close={closeModal} 
                add={addExercise}
            />
            <OptionsModal
                visible={optionsModal} 
                close={() => setOptionsModal(false)} 
                routine={routine}
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