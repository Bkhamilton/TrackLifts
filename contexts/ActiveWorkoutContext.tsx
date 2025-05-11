// app/contexts/BetContext/BetContext.tsx
import { ActiveRoutine, Exercise } from '@/utils/types';
import React, { createContext, ReactNode, useState } from 'react';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: ActiveRoutine;
    setRoutine: React.Dispatch<React.SetStateAction<ActiveRoutine>>;
    addToRoutine: (exercise: Exercise) => void;
    // activeWorkout: Workout | null;
    // setActiveWorkout: (workout: Workout) => void;
    // addExerciseToWorkout: (exercise: Exercise) => void;
    // removeExerciseFromWorkout: (exerciseId: number) => void;
}

export const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue>({
    routine: {
        id: 0,
        title: 'Empty Workout',
        exercises: [
            {
                id: 0,
                title: 'Empty Exercise',
                equipment: 'None',
                muscleGroupId: 0,
                muscleGroup: 'None',
                sets: [
                    {
                        id: 0,
                        reps: 0,
                        weight: 0,
                        restTime: 0,
                        order: 0,
                    },
                ],
            },
        ],
    } as ActiveRoutine,
    setRoutine: () => {},
    addToRoutine: () => {},
    // activeWorkout: null,
    // setActiveWorkout: () => {},
    // addExerciseToWorkout: () => {},
    // removeExerciseFromWorkout: () => {},
});

interface ActiveWorkoutContextValueProviderProps {
    children: ReactNode;
}

export const ActiveWorkoutContextProvider = ({ children }: ActiveWorkoutContextValueProviderProps) => {

    const [routine, setRoutine] = useState<ActiveRoutine>({
        id: 0,
        title: 'Empty Workout',
        exercises: [
            {
                id: 0,
                title: 'Empty Exercise',
                equipment: 'None',
                muscleGroupId: 0,
                muscleGroup: 'None',
                sets: [
                    {
                        id: 0,
                        reps: 0,
                        weight: 0,
                        restTime: 0,
                        order: 0,
                    },
                ],
            },
        ],
    } as ActiveRoutine);

    const addToRoutine = (exercise: Exercise) => {
        const exerciseWithSets = {
            ...exercise,
            sets: [
                {
                    id: Date.now(), // Use a unique ID for the set
                    reps: 10, // Default reps
                    weight: 0, // Default weight
                    restTime: 60, // Default rest time in seconds
                    order: routine.exercises.length + 1, // Set the order based on the current number of exercises
                },
            ],
        };
        console.log('Adding exercise to routine:', exerciseWithSets);
    
        setRoutine((prevRoutine) => ({
            ...prevRoutine,
            exercises: [...prevRoutine.exercises, exerciseWithSets],
        }));
    };

    const value = {
        routine,
        setRoutine,
        addToRoutine,
        // activeWorkout,
        // setActiveWorkout,
        // addExerciseToWorkout,
        // removeExerciseFromWorkout,
    };

    return (
        <ActiveWorkoutContext.Provider value={value}>
            {children}
        </ActiveWorkoutContext.Provider>
    );
};