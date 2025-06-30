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

    const { removeFavoriteGraph } = useContext(DataContext);

    const { workoutFrequency } = useContext(WorkoutContext);
    const { workoutCount, addFavoriteGraph, favoriteGraphs, fetchExerciseStats, refreshData } = useContext(DataContext);

    const [favoriteGraphDisplay, setFavoriteGraphDisplay] = useState<FavoriteGraph[]>(favoriteGraphs);
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
        setFavoriteGraphDisplay((prev) =>
            prev.filter((graph) => graph.exercise_id !== exerciseId || graph.graphType !== graphType)
        );
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

        // Prepare date range (last 1 months)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 1);
        const formattedEnd = endDate.toISOString().slice(0, 10);
        const formattedStart = startDate.toISOString().slice(0, 10);

        // Map graphType to statType
        const graphTypeToStatType: Record<string, 'heaviest_set' | 'top_set' | 'most_reps' | 'total_volume' | 'avg_weight'> = {
            'Top Set': 'top_set',
            'Heaviest Set': 'heaviest_set',
            'Most Weight Moved': 'total_volume',
            'Average Weight': 'avg_weight',
            'Most Repetitions': 'most_reps',
        };
        const statType = graphTypeToStatType[graphType] || 'top_set';

        // Fetch stats
        const stats = await fetchExerciseStats(
            exercise.id,
            formattedStart,
            formattedEnd,
            statType
        );

        // Add to display state (with stats)
        setFavoriteGraphDisplay((prev) => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                exercise: exercise.title,
                exercise_id: exercise.id,
                equipment: exercise.equipment,
                graphType: graphType,
                stats,
            },
        ]);
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
        caloriesBurned: 0 // This can be calculated based on workout history if needed,
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
        favoriteGraphDisplay,
        setFavoriteGraphDisplay,
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
