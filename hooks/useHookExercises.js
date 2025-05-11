import { useState } from 'react';

const useHookExercises = () => {

    const [addExerciseModal, setAddExerciseModal] = useState(false);
    const [exerciseModal, setExerciseModal] = useState(false);
    const [exercise, setExercise] = useState({
        title: '',
        equipment: '',
        muscleGroup: '',
    });

    const openAddExerciseModal = () => setAddExerciseModal(true);``
    const closeAddExerciseModal = () => setAddExerciseModal(false);

    const openExerciseModal = (exercise) => {
        setExercise(exercise);
        setExerciseModal(true);
    }
    const closeExerciseModal = () => {
        setExercise({
            title: '',
            equipment: '',
            muscleGroup: '',
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