import { DBContext } from '@/contexts/DBContext';
import useHookExercises from '@/hooks/useHookExercises';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal';
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
                    exercises={exercises} 
                    openModal={openExerciseModal}
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