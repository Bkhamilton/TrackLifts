import { useState } from 'react';

interface FavoriteGraph {
    id: string;
    exercise: string;
    graphType: string;
    currentMax: string;
    progress: string;
    lastUpdated: string;
}

export default function useHookData() {
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

    const [favoriteGraphs, setFavoriteGraphs] = useState<FavoriteGraph[]>([
        {
            id: '1',
            exercise: 'Bench Press',
            graphType: 'Top Set',
            currentMax: '225 lbs',
            progress: '+10 lbs',
            lastUpdated: '2 days ago'
        },
        {
            id: '2',
            exercise: 'Squats',
            graphType: 'Most Weight Moved',
            currentMax: '315 lbs',
            progress: '+25 lbs',
            lastUpdated: '1 week ago'
        },
        {
            id: '3',
            exercise: 'Deadlifts',
            graphType: 'Strength Progress',
            currentMax: '405 lbs',
            progress: '+15 lbs',
            lastUpdated: '3 days ago'
        }
    ]);

    const handleAddFavorite = () => {
        // Open modal to create new favorite graph
    };

    const handleSelectGraph = (graph: FavoriteGraph) => {
        // Navigate to or open the selected graph
    };

    // Mock data
    const workoutStats = {
        streak: 7,
        frequency: "5 times/week",
        lastWorkout: "Yesterday",
        totalWorkouts: 42,
        caloriesBurned: 12_450,
    };

    const handleExerciseSelect = (exercise: string) => {
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
