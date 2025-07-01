import { Exercise } from '@/constants/types';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useContext } from 'react';

export const useWorkoutActions = () => {
    const { routine, addToRoutine, updateRoutine, replaceExercise } = useContext(ActiveWorkoutContext);

    const addExercise = (exercise: Exercise) => {
        addToRoutine(exercise);
    };

    const updateSet = (
        exerciseIndex: number,
        setId: number,
        field: 'weight' | 'reps',
        value: string
    ) => {
        const numericValue = parseFloat(value) || 0;
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIndex) {
                    return {
                        ...exercise,
                        sets: exercise.sets.map(set =>
                            set.id === setId ? { ...set, [field]: numericValue } : set
                        ),
                    };
                }
                return exercise;
            }),
        });
    };

    const addSet = (exerciseIndex: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIndex) {
                    const newSet = {
                        id: Date.now(),
                        set_order: exercise.sets.length + 1,
                        weight:
                            exercise.sets.length > 0
                                ? exercise.sets[exercise.sets.length - 1].weight
                                : 0,
                        reps:
                            exercise.sets.length > 0
                                ? exercise.sets[exercise.sets.length - 1].reps
                                : 0,
                        restTime: 60,
                    };
                    return {
                        ...exercise,
                        sets: [...exercise.sets, newSet],
                    };
                }
                return exercise;
            }),
        });
    };

    const deleteSet = (exerciseIndex: number, setId: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIndex) {
                    return {
                        ...exercise,
                        sets: exercise.sets.filter(set => set.id !== setId),
                    };
                }
                return exercise;
            }),
        });
    };

    const deleteExercise = (exerciseIndex: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.filter((_, idx) => idx !== exerciseIndex),
        });
    };

    const replaceExerciseInRoutine = (exerciseId: number, newExercise: Exercise) => {
        replaceExercise(exerciseId, newExercise);
    }

    return { addExercise, updateSet, addSet, deleteSet, deleteExercise, replaceExerciseInRoutine };
};