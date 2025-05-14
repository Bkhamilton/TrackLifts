import { DBContext } from '@/contexts/DBContext';
import useHookExercises from '@/hooks/useHookExercises';
import { sortList } from '@/utils/exerciseUtils';
import { Equipment, MuscleGroup } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal/AddExerciseModal';
import ExerciseModal from '../components/modals/ExerciseModal';
import { View } from '../components/Themed';
import Title from '../components/Title';

export default function ExercisesScreen() {
    const { exercises, addExerciseToDB } = useContext(DBContext);

    const [sortedExercises, setSortedExercises] = useState(exercises);

    const {
        addExerciseModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        exerciseModal,
        exercise,
        openExerciseModal,
        closeExerciseModal
    } = useHookExercises();

    const clearAllStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('All AsyncStorage data cleared.');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };    
    
    function clearSort() {
        setSortedExercises(exercises); // Reset to original order
    }

    const onAdd = async (exercise: { title: string, equipment: Equipment, muscleGroup: MuscleGroup }) => {
        const { title, equipment, muscleGroup } = exercise;
        const toAdd = {
            id: 0, // Temporary placeholder
            title: title,
            equipmentId: equipment.id,
            equipment: equipment.name,
            muscleGroupId: muscleGroup.id,
            muscleGroup: muscleGroup.name,
        };
    
        try {
            const newExerciseId = await addExerciseToDB(toAdd); // Await the Promise
            if (newExerciseId !== undefined) {
                toAdd.id = newExerciseId; // Assign the returned ID
                setSortedExercises([...sortedExercises, toAdd]); // Update the state
            } else {
                console.error("Failed to add exercise to the database.");
            }
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    
        closeAddExerciseModal(); // Close the modal
    };

    return (
        <View style={styles.container}>
            <AddExerciseModal 
                visible={addExerciseModal} 
                close={closeAddExerciseModal} 
                add={onAdd}
            />
            <ExerciseModal 
                visible={exerciseModal} 
                close={closeExerciseModal} 
                exercise={exercise} 
                onDelete={closeExerciseModal}
            />
            <View style={{ top:60 }}>
                <Title title="Exercises"></Title>
                <TouchableOpacity
                    style = {styles.plusButton}
                    onPress={clearAllStorage}
                >
                    <View>
                        <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                    </View>  
                </TouchableOpacity>
            </View>
            <View style={{ top: 60, paddingTop: 10 }}>
                <ExerciseList 
                    exercises={sortedExercises} 
                    openModal={openExerciseModal}
                    sortList={(criteria) => setSortedExercises(sortList(exercises, criteria))}
                    clearSort={clearSort}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    plusButton: {
        position: 'absolute',
        right: 18,
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