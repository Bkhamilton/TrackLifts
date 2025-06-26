import MiniSparkline from '@/components/Data/Graphs/MiniSparkline';
// import StrengthProgressChart from '@/components/Data/StrengthProgressChart';
// import WorkoutFrequencyChart from '@/components/Data/WorkoutFrequencyChart';
import DataHeader from '@/components/Data/DataHeader';
import ExerciseAnalysis from '@/components/Data/ExerciseAnalysis';
import FavoriteGraphs from '@/components/Data/FavoriteGraphs';
import FavoriteRoutines from '@/components/Data/FavoriteRoutines';
import MuscleGroupStats from '@/components/Data/MuscleGroupStats';
import WorkoutHistory from '@/components/Data/WorkoutHistory';
import AddToWorkoutModal from '@/components/modals/AddToWorkoutModal';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import useHookData from '@/hooks/useHookData';
import { buildLast30DaysFrequency, buildLast7DaysFrequency } from '@/utils/workoutUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function DataScreen() {
    const {
        showExerciseModal,
        setShowExerciseModal,
        selectedExercise,
        handleExerciseSelect,
        favoriteGraphs,
        handleAddFavorite,
        handleSelectGraph,
        workoutStats,
    } = useHookData();

    const router = useRouter();

    const { workoutFrequency } = useContext(WorkoutContext);

    const [weeklyFrequency, setWeeklyFrequency] = useState<any[]>(buildLast7DaysFrequency(workoutFrequency));
    const [monthlyFrequency, setMonthlyFrequency] = useState<any[]>(buildLast30DaysFrequency(workoutFrequency));

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
            style={{ flex: 1, paddingVertical: 16, marginBottom: 85 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ paddingHorizontal: 16 }}>
                <DataHeader 
                    stats={workoutStats} 
                    weeklyFrequency={weeklyFrequency}
                />
            </View>
            
            <FavoriteGraphs
                favorites={favoriteGraphs}
                onAddFavorite={handleAddFavorite}
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

            <AddToWorkoutModal
                visible={showExerciseModal}
                close={() => setShowExerciseModal(false)}
                add={(exercise) => handleExerciseSelect(exercise)}
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
        paddingTop: 10,
    }
});