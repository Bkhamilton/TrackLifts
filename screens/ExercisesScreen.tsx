import SearchExerciseModal from '@/components/modals/SearchExerciseModal';
import { ExerciseContext } from '@/contexts/ExerciseContext';
import useHookExercises from '@/hooks/useHookExercises';
import { sortList } from '@/utils/exerciseUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal/AddExerciseModal';
import ExerciseModal from '../components/modals/ExerciseModal/ExerciseModal';
import { View } from '../components/Themed';
import Title from '../components/Title';

export default function ExercisesScreen() {
    
    const { exercises, deleteExerciseFromDB } = useContext(ExerciseContext);
    
    const {
        addExerciseModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        exerciseModal,
        searchModalVisible,
        openSearchModal,
        closeSearchModal,
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
            <SearchExerciseModal
                visible={searchModalVisible} 
                onClose={closeSearchModal} 
                onSelect={(exercise) => {
                    openExerciseModal(exercise);
                    closeSearchModal();
                }}
            />
            <AddExerciseModal 
                visible={addExerciseModal} 
                close={closeAddExerciseModal} 
                add={onAdd}
            />
            <ExerciseModal 
                visible={exerciseModal} 
                close={closeExerciseModal} 
                exercise={exercise} 
                onDelete={deleteExerciseFromDB}
            />
            <Title 
                title="Exercises"
                rightContent={
                    <View style={styles.headerRight}>
                        <TouchableOpacity 
                            onPress={openSearchModal}
                            style={styles.searchButton}
                        >
                            <MaterialCommunityIcons name="magnify" size={24} color="#ff8787" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={openAddExerciseModal}
                        >
                            <View>
                                <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                            </View>  
                        </TouchableOpacity>
                    </View>
                }
            />
            <View style={styles.exerciseContainer}>
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
    exerciseContainer: {
        width: '100%',
        padding: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchButton: {
        marginRight: 8,
    },
});