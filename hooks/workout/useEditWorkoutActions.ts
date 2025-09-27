import { ActiveExercise, ActiveRoutine, Exercise } from '@/constants/types';
import React from 'react';

export const useEditWorkoutActions = (
    routine: ActiveRoutine,
    setRoutine: React.Dispatch<React.SetStateAction<ActiveRoutine>>
) => {

    const addExercise = (exercise: Exercise) => {
        const exerciseWithSets: ActiveExercise = {
            ...exercise,
            sets: [
                {
                    id: Date.now(),
                    reps: 10,
                    weight: 0,
                    restTime: 60,
                    set_order: 1,
                },
            ],
        };
        setRoutine({
            ...routine,
            exercises: [...routine.exercises, exerciseWithSets],
        });
    };

    const updateSet = (exerciseIdx: number, setId: number, field: 'weight' | 'reps', value: string) => {
        const numericValue = parseFloat(value) || 0;
        setRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIdx) {
                    return {
                        ...exercise,
                        sets: exercise.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, [field]: numericValue };
                            }
                            return set;
                        }),
                    };
                }
                return exercise;
            }),
        });
    };

    const addSet = (exerciseIdx: number) => {
        setRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIdx) {
                    const newSet = {
                        id: Date.now(),
                        set_order: exercise.sets.length + 1,
                        weight: exercise.sets.length > 0 
                            ? exercise.sets[exercise.sets.length - 1].weight 
                            : 0,
                        reps: exercise.sets.length > 0 
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

    const deleteSet = (exerciseIdx: number, setId: number) => {
        setRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) => {
                if (idx === exerciseIdx) {
                    return {
                        ...exercise,
                        sets: exercise.sets.filter(set => set.id !== setId),
                    };
                }
                return exercise;
            }),
        });
    };

    const deleteExercise = (exerciseIdx: number) => {
        setRoutine({
            ...routine,
            exercises: routine.exercises.filter((_, idx) => idx !== exerciseIdx),
        });
    };

    const replaceExerciseInRoutine = (oldExerciseId: number, newExercise: Exercise) => {
        const newExerciseWithSets: ActiveExercise = {
            ...newExercise,
            sets: [
                {
                    id: Date.now(),
                    reps: 10,
                    weight: 0,
                    restTime: 60,
                    set_order: 1,
                },
            ],
        };
        setRoutine({
            ...routine,
            exercises: routine.exercises.map((exercise, idx) =>
                idx === oldExerciseId ? newExerciseWithSets : exercise
            ),
        });
    };

    return { addExercise, updateSet, addSet, deleteSet, deleteExercise, replaceExerciseInRoutine };
};