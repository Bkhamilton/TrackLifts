import MiniSparkline from '@/components/Data/Graphs/MiniSparkline';
// import StrengthProgressChart from '@/components/Data/StrengthProgressChart';
// import WorkoutFrequencyChart from '@/components/Data/WorkoutFrequencyChart';
import DataHeader from '@/components/Data/DataHeader';
import ExerciseAnalysis from '@/components/Data/ExerciseAnalysis';
import FavoriteGraphs from '@/components/Data/FavoriteGraphs';
import FavoriteRoutines from '@/components/Data/FavoriteRoutines';
import MuscleGroupStats from '@/components/Data/MuscleGroupStats';
import WorkoutHistory from '@/components/Data/WorkoutHistory';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import AddFavoriteGraphModal from '@/components/modals/Data/AddFavoriteGraphModal';
import FavoriteGraphDisplayModal from '@/components/modals/Data/FavoriteGraphDisplayModal';
import AddToWorkoutModal from '@/components/modals/Workout/AddToWorkoutModal';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookData from '@/hooks/profile/useHookData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

export default function DataScreen() {
    const {
        showExerciseModal,
        setShowExerciseModal,
        selectedExercise,
        handleExerciseSelect,
        favoriteGraphDisplay,
        setFavoriteGraphDisplay,
        handleAddFavorite,
        handleSelectGraph,
        workoutStats,
        showFavoriteGraphModal,
        setShowFavoriteGraphModal,
        selectedGraph,
        weeklyFrequency,
        monthlyFrequency,
        favoriteGraphModal,
        setFavoriteGraphModal,
        refreshing,
        handleRefresh,        
        showRemoveConfirm,
        setShowRemoveConfirm,
        pendingRemoveGraph,
        handleRequestRemoveFavorite,
        handleConfirmRemove,
    } = useHookData();

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Title 
                title="Data"
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/profile/main');
                        }}
                        style={{ marginRight: 12 }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                }
                rightContent={
                    <MiniSparkline data={[
                        { x: 1, y: 2 },
                        { x: 2, y: 3 },
                        { x: 3, y: 5 },
                        { x: 4, y: 4 },
                        { x: 5, y: 6 }
                    ]} />
                }
            />
        <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#ff8787']}
                />   
            }
        >
            <View style={styles.cardContainer}>
                <DataHeader 
                    stats={workoutStats} 
                    weeklyFrequency={weeklyFrequency}
                />
            </View>
            
            <FavoriteGraphs
                favorites={favoriteGraphDisplay}
                onAddFavorite={() => setFavoriteGraphModal(true)}
                onSelectGraph={handleSelectGraph}
            />
            
            <ExerciseAnalysis 
                exercise={selectedExercise || {id: 0, title: "Select an Exercise", equipment: "None", muscleGroupId: 0, muscleGroup: "None"}} 
                onSelectExercise={() => setShowExerciseModal(true)}
            />
            
            <MuscleGroupStats />
            
            <WorkoutHistory 
                data={monthlyFrequency}
            />
            
            <FavoriteRoutines />

            <FavoriteGraphDisplayModal
                visible={showFavoriteGraphModal}
                onClose={() => setShowFavoriteGraphModal(false)}
                graph={selectedGraph || { id: '', exercise: '', exercise_id: 0, equipment: '', graphType: '', stats: [] }}
                onRequestRemoveFavorite={handleRequestRemoveFavorite}
            />
            
            <AddFavoriteGraphModal
                visible={favoriteGraphModal}
                onClose={() => setFavoriteGraphModal(false)}
                onSave={async (exercise, graphType) => {
                    // Handle saving favorite graph
                    await handleAddFavorite(exercise, graphType);
                    setFavoriteGraphModal(false);
                }}
            />
            <AddToWorkoutModal
                visible={showExerciseModal}
                close={() => setShowExerciseModal(false)}
                add={(exercise) => handleExerciseSelect(exercise)}
            />

            <ConfirmationModal
                visible={showRemoveConfirm}
                onClose={() => setShowRemoveConfirm(false)}
                message={
                    pendingRemoveGraph
                        ? `Are you sure you want to remove ${pendingRemoveGraph.exercise} from your favorites?`
                        : ''
                }
                onSelect={handleConfirmRemove}
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
    scrollContainer: {
        flex: 1, 
        paddingVertical: 16, 
        marginBottom: 85,
        width: '100%',
    },
    cardContainer: {
        paddingHorizontal: 16,
    }
});