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
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const { workoutHistory, workoutFrequency } = useContext(WorkoutContext);
    const { workoutCount, addFavoriteGraph } = useContext(DataContext);

    const [favoriteGraphs, setFavoriteGraphs] = useState<FavoriteGraph[]>([
        {
            id: '1',
            exercise: 'Bench Press',
            equipment: 'Barbell',
            graphType: 'Top Set',
        },
        {
            id: '2',
            exercise: 'Squats',
            equipment: 'Barbell',
            graphType: 'Heaviest Set',
        },
        {
            id: '3',
            exercise: 'Deadlifts',
            equipment: 'Barbell',
            graphType: 'Average Weight',
        }
    ]);

    const handleAddFavorite = async (exercise: Exercise, graphType: string) => {
        // Open modal to create new favorite graph
        await addFavoriteGraph(exercise.id, graphType);
        setFavoriteGraphs((prev) => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                exercise: exercise.title,
                equipment: exercise.equipment,
                graphType: graphType,
            },
        ]);
    };

    const handleSelectGraph = (graph: FavoriteGraph) => {
        // Navigate to or open the selected graph
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
        favoriteGraphs,
        setFavoriteGraphs,
        handleAddFavorite,
        handleSelectGraph,
        workoutStats,
        handleExerciseSelect,
    };
}
