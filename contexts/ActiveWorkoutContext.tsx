// app/contexts/BetContext/BetContext.tsx
import { ActiveRoutine } from '@/utils/types';
import React, { createContext, ReactNode, useState } from 'react';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: ActiveRoutine;
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
        exercises: [],
    } as ActiveRoutine);

    const value = {
        routine,
        setRoutine,
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