import { DBContext } from '@/contexts/DBContext';
import useHookExercises from '@/hooks/useHookExercises';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal';
import ExerciseModal from '../components/modals/ExerciseModal';
import { View } from '../components/Themed';
import Title from '../components/Title';

export default function ExercisesScreen() {
    const { exercises } = useContext(DBContext);

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

    function sortList(criteria: string[]) {
        let sortedArray = [...exercises]; // Create a copy of the exercises array
    
        sortedArray.sort((a, b) => {
            for (const criterion of criteria) {
                if (criterion === "title") {
                    const result = a.title.localeCompare(b.title);
                    if (result !== 0) return result;
                } else if (criterion === "equipment") {
                    const result = a.equipment.localeCompare(b.equipment);
                    if (result !== 0) return result;
                } else if (criterion === "muscleGroup") {
                    const result = a.muscleGroup.localeCompare(b.muscleGroup);
                    if (result !== 0) return result;
                }
            }
            return 0; // If all criteria are equal
        });
    
        setSortedExercises(sortedArray); // Update the sortedExercises state
    }
    
    function clearSort() {
        setSortedExercises(exercises); // Reset to original order
    }

    return (
        <View style={styles.container}>
            <AddExerciseModal 
                visible={addExerciseModal} 
                close={closeAddExerciseModal} 
                add={closeAddExerciseModal}
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
                    onPress={openAddExerciseModal}
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
                    sortList={sortList}
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