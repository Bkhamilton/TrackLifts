// app/contexts/BetContext/BetContext.tsx
import { Routine } from '@/utils/types';
import React, { createContext, ReactNode, useState } from 'react';

interface ActiveWorkoutContextValue {
    // Define the properties and methods you want to expose in the context
    // For example:
    routine: Routine;
    // activeWorkout: Workout | null;
    // setActiveWorkout: (workout: Workout) => void;
    // addExerciseToWorkout: (exercise: Exercise) => void;
    // removeExerciseFromWorkout: (exerciseId: number) => void;
}

export const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue>({
    routine: {
        id: 0,
        title: 'Empty Workout',
        exercises: [],
    } as Routine,
    // activeWorkout: null,
    // setActiveWorkout: () => {},
    // addExerciseToWorkout: () => {},
    // removeExerciseFromWorkout: () => {},
});

interface ActiveWorkoutContextValueProviderProps {
    children: ReactNode;
}

export const ActiveWorkoutContextProvider = ({ children }: ActiveWorkoutContextValueProviderProps) => {

    const [routine, setRoutine] = useState<Routine>({
        id: 0,
        title: 'Empty Workout',
        exercises: [],
    } as Routine);

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