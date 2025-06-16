import { ExerciseContext } from '@/contexts/ExerciseContext';
import { Equipment, Exercise, MuscleGroup } from '@/utils/types';
import { useContext, useEffect, useState } from 'react';

const useHookExercises = () => {

    const { exercises, addExerciseToDB } = useContext(ExerciseContext);

    useEffect(() => {
        setSortedExercises(exercises);
    }, [exercises]);

    const [addExerciseModal, setAddExerciseModal] = useState(false);
    const [exerciseModal, setExerciseModal] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [exercise, setExercise] = useState({
        id: 0,
        title: '',
        equipment: '',
        muscleGroup: '',
        muscleGroupId: 0,
    });
    const [sortedExercises, setSortedExercises] = useState<Exercise[]>(exercises);

    const openAddExerciseModal = () => setAddExerciseModal(true);
    const closeAddExerciseModal = () => setAddExerciseModal(false);

    const openExerciseModal = (exercise: Exercise) => {
        setExercise(exercise);
        setExerciseModal(true);
    }
    const closeExerciseModal = () => {
        setExerciseModal(false);
    }

    const openSearchModal = () => setSearchModalVisible(true);
    const closeSearchModal = () => setSearchModalVisible(false);

    const onAdd = async (exercise: { title: string, equipment: Equipment, muscleGroup: MuscleGroup, muscleIntensities: any[] }) => {
        const { title, equipment, muscleGroup, muscleIntensities } = exercise;
        const toAdd = {
            id: 0, // Temporary placeholder
            title: title,
            equipmentId: equipment.id,
            equipment: equipment.name,
            muscleGroupId: muscleGroup.id,
            muscleGroup: muscleGroup.name,
            muscles: muscleIntensities.map((muscle) => ({
                id: muscle.muscleId,
                name: muscle.muscleName,
                intensity: muscle.intensity,
                muscleGroup: muscle.groupName
            })),
        };
    
        try {
            const newExerciseId = await addExerciseToDB(toAdd); // Await the Promise
            if (!newExerciseId) {
                console.error("Failed to add exercise to the database.");
            }
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    
        closeAddExerciseModal(); // Close the modal
    };

    function clearSort() {
        setSortedExercises(exercises); // Reset to original order
    }

    return {
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
    };
};

export default useHookExercises;