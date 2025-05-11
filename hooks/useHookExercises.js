import { useState } from 'react';

const useHookExercises = () => {

    const [addExerciseModal, setAddExerciseModal] = useState(false);
    const [exerciseModal, setExerciseModal] = useState(false);
    const [exercise, setExercise] = useState({
        id: 0,
        title: '',
        equipment: '',
        muscleGroup: '',
        muscleGroupId: 0,
    });

    const openAddExerciseModal = () => setAddExerciseModal(true);``
    const closeAddExerciseModal = () => setAddExerciseModal(false);

    const openExerciseModal = (exercise) => {
        setExercise(exercise);
        setExerciseModal(true);
    }
    const closeExerciseModal = () => {
        setExercise({
            id: 0,
            title: '',
            equipment: '',
            muscleGroup: '',
            muscleGroupId: 0,
        });
        setExerciseModal(false);
    }

    return {
        addExerciseModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        exerciseModal,
        exercise,
        openExerciseModal,
        closeExerciseModal
    };
};

export default useHookExercises;