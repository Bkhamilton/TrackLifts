import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import WorkoutDisplay from '@/components/Workout/NewWorkout/WorkoutDisplay';
import AddExerciseModal from '@/components/modals/Workout/AddExerciseModal';
import WorkoutOptionsModal from '@/components/modals/Workout/WorkoutOptionsModal';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import useHookNewWorkout from '@/hooks/workout/useHookNewWorkout';
import { useWorkoutActions } from '@/hooks/workout/useWorkoutActions';
import { SimpleLineIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function NewWorkoutScreen() {
    const {
        addWorkoutModal,
        optionsModal,
        openWorkoutModal,
        closeWorkoutModal,
        openOptionsModal,
        closeOptionsModal,
        onStartWorkout
    } = useHookNewWorkout();
    const { routine } = useContext(ActiveWorkoutContext);
    const { addExercise } = useWorkoutActions();

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
                            onPress={openOptionsModal}
                        >
                            <SimpleLineIcons name="options" size={20} color="#ff8787" />
                        </TouchableOpacity>
                    ) : null
                }
            />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}                
            >
                <WorkoutDisplay 
                    routine={routine} 
                    open={openWorkoutModal}
                />
            </ScrollView>
            <AddExerciseModal 
                visible={addWorkoutModal} 
                close={closeWorkoutModal} 
                mode="add"
                onSelect={addExercise}
            />
            <WorkoutOptionsModal
                visible={optionsModal} 
                close={closeOptionsModal} 
                routine={routine}
            />            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        marginBottom: 85,
        width: '100%',
        paddingHorizontal: 12,
        paddingTop: 10,
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