import { DBContext } from '@/contexts/DBContext';
import useHookExercises from '@/hooks/useHookExercises';
import { sortList } from '@/utils/exerciseUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal/AddExerciseModal';
import ExerciseModal from '../components/modals/ExerciseModal';
import { View } from '../components/Themed';
import Title from '../components/Title';

export default function ExercisesScreen() {
    
    const { exercises } = useContext(DBContext);
    
    const {
        addExerciseModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        exerciseModal,
        exercise,
        openExerciseModal,
        closeExerciseModal,
        sortedExercises,
        setSortedExercises,
        onAdd,
        clearSort,
    } = useHookExercises(); 

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