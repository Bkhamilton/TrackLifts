import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { Exercise } from '@/utils/types';
import { useContext } from 'react';

export const useWorkoutActions = () => {
    const { routine, addToRoutine, updateRoutine } = useContext(ActiveWorkoutContext);

    const addExercise = (exercise: Exercise) => {
        addToRoutine(exercise);
    };

    const updateSet = (exerciseId: number, setId: number, field: 'weight' | 'reps', value: string) => {
        const numericValue = parseFloat(value) || 0;
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        sets: exercise.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, [field]: numericValue };
                            }
                            return set;
                        })
                    };
                }
                return exercise;
            })
        });
    };

    const addSet = (exerciseId: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    const newSet = {
                        id: Date.now(),
                        set_order: exercise.sets.length + 1,
                        weight: exercise.sets.length > 0 
                            ? exercise.sets[exercise.sets.length - 1].weight 
                            : 0,
                        reps: exercise.sets.length > 0 
                            ? exercise.sets[exercise.sets.length - 1].reps 
                            : 0,
                        restTime: 60
                    };
                    return {
                        ...exercise,
                        sets: [...exercise.sets, newSet]
                    };
                }
                return exercise;
            })
        });
    };

    const deleteSet = (exerciseId: number, setId: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        sets: exercise.sets.filter(set => set.id !== setId)
                    };
                }
                return exercise;
            })
        });
    }

    const deleteExercise = (exerciseId: number) => {
        updateRoutine({
            ...routine,
            exercises: routine.exercises.filter(exercise => exercise.id !== exerciseId)
        });
    }

    return { addExercise, updateSet, addSet, deleteSet, deleteExercise };
};