import { Exercise, FavoriteGraph } from '@/constants/types';
import { DataContext } from '@/contexts/DataContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { calculateLastWorkout, calculateStreak, calculateWeeklyFrequency } from '@/utils/dataCalculations';
import { buildLast30DaysFrequency, buildLast7DaysFrequency } from '@/utils/workoutUtils';
import { useContext, useState } from 'react';

export default function useHookData() {
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showFavoriteGraphModal, setShowFavoriteGraphModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const { workoutFrequency } = useContext(WorkoutContext);
    const { 
        workoutCount, 
        addFavoriteGraph, 
        removeFavoriteGraph,
        refreshData,
        totalCaloriesBurned,
    } = useContext(DataContext);

    const [selectedGraph, setSelectedGraph] = useState<FavoriteGraph | null>(null);

    const weeklyFrequency = buildLast7DaysFrequency(workoutFrequency);
    const monthlyFrequency = buildLast30DaysFrequency(workoutFrequency);

    const [favoriteGraphModal, setFavoriteGraphModal] = useState(false);

    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [pendingRemoveGraph, setPendingRemoveGraph] = useState<FavoriteGraph | null>(null);

    const handleRequestRemoveFavorite = (graph: FavoriteGraph) => {
        setPendingRemoveGraph(graph);
        setShowRemoveConfirm(true);
    };

    const handleConfirmRemove = (choice: 'yes' | 'no') => {
        setShowRemoveConfirm(false);
        if (choice === 'yes' && pendingRemoveGraph) {
            // Actually remove favorite here
            handleRemoveFavorite(pendingRemoveGraph.exercise_id, pendingRemoveGraph.graphType);
        }
        setPendingRemoveGraph(null);
    };

    const handleRemoveFavorite = (exerciseId: number, graphType: string) => {
        removeFavoriteGraph(exerciseId, graphType);
        setShowFavoriteGraphModal(false);
    }

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        refreshData();
        setRefreshing(false);
    };    

    const handleAddFavorite = async (exercise: Exercise, graphType: string) => {
        // Open modal to create new favorite graph
        await addFavoriteGraph(exercise.id, graphType);
    };

    const handleSelectGraph = (graph: FavoriteGraph) => {
        // Navigate to or open the selected graph
        setSelectedGraph(graph);
        setShowFavoriteGraphModal(true);
    };

    // Mock data
    const workoutStats = {
        streak: calculateStreak(workoutFrequency),
        frequency: calculateWeeklyFrequency(workoutFrequency),
        lastWorkout: calculateLastWorkout(workoutFrequency),
        totalWorkouts: workoutCount.total,
        caloriesBurned: totalCaloriesBurned,
    };

    const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setShowExerciseModal(false);
    };

    return {
        showExerciseModal,
        setShowExerciseModal,
        selectedExercise,
        setSelectedExercise,
        handleAddFavorite,
        handleSelectGraph,
        workoutStats,
        handleExerciseSelect,
        showFavoriteGraphModal,
        setShowFavoriteGraphModal,
        selectedGraph,
        setSelectedGraph,
        weeklyFrequency,
        monthlyFrequency,
        favoriteGraphModal,
        setFavoriteGraphModal,
        refreshing,
        handleRefresh,
        showRemoveConfirm,
        setShowRemoveConfirm,
        pendingRemoveGraph,
        setPendingRemoveGraph,
        handleRequestRemoveFavorite,
        handleConfirmRemove,
        handleRemoveFavorite,
    };
}
