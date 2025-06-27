import { DataContext } from '@/contexts/DataContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { calculateLastWorkout, calculateStreak, calculateWeeklyFrequency } from '@/utils/dataCalculations';
import { Exercise } from '@/utils/types';
import { useContext, useState } from 'react';

interface FavoriteGraph {
    id: string;
    exercise: string;
    equipment: string;
    graphType: string;
}

export default function useHookData() {
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showFavoriteGraphModal, setShowFavoriteGraphModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const { workoutFrequency } = useContext(WorkoutContext);
    const { workoutCount, addFavoriteGraph, favoriteGraphs, fetchExerciseStats } = useContext(DataContext);

    const [favoriteGraphDisplay, setFavoriteGraphDisplay] = useState<FavoriteGraph[]>(favoriteGraphs);
    const [selectedGraph, setSelectedGraph] = useState<FavoriteGraph | null>(null);

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
    };
}
