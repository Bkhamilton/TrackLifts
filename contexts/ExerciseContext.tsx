// app/contexts/ExerciseContext.tsx
import { deleteExerciseMuscleByExerciseId, insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { deleteExercise, insertExercise } from '@/db/general/Exercises';
import { deleteExerciseSetsByExerciseId } from '@/db/user/ExerciseSets';
import { getExerciseData } from '@/utils/exerciseHelpers';
import { Exercise } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';

interface ExerciseContextValue {
    exercises: Exercise[];
    addExerciseToDB: (exercise: Exercise) => Promise<number | undefined>;
    deleteExerciseFromDB: (exerciseId: number) => Promise<void>;
}

export const ExerciseContext = createContext<ExerciseContextValue>({
    exercises: [],
    addExerciseToDB: async () => {
        return undefined;
    },
    deleteExerciseFromDB: async () => {
        // do nothing
    },
});

interface ExerciseContextValueProviderProps {
    children: ReactNode;
}

export const ExerciseContextProvider = ({ children }: ExerciseContextValueProviderProps) => {

    const { db } = useContext(DBContext);

    const [exercises, setExercises] = useState<Exercise[]>([]);

    const addExerciseToDB = async (exercise: Exercise): Promise<number | undefined> => {
        if (db) {
            try {
                // Insert the exercise into the database and get the inserted ID
                const exerciseId = await insertExercise(db, exercise);

                // For each muscle in the exercise, insert a ExerciseMuscles entry
                if (exercise.muscles) {
                    for (const muscle of exercise.muscles) {
                        await insertExerciseMuscle(db, {
                            exerciseId,
                            muscleId: muscle.id,
                            intensity: muscle.intensity,
                        });
                    }
                }
    
                // Update the exercises state with the new exercise, including the returned ID
                getExerciseData(db).then((data) => {
                    setExercises(data || []);
                });
    
                return exerciseId; // Return the ID of the newly inserted exercise
            } catch (error) {
                console.error('Error adding exercise to DB:', error);
                return undefined; // Return undefined in case of an error
            }
        }
        return undefined; // Return undefined if the database is not available
    };

    const deleteExerciseFromDB = async (exerciseId: number): Promise<void> => {
        if (db) {
            try {
                // Delete the exercise from the database
                await deleteExercise(db, exerciseId);
                // also delete the associated ExerciseMuscles and ExerciseSets entries
                await deleteExerciseMuscleByExerciseId(db, exerciseId);
                await deleteExerciseSetsByExerciseId(db, exerciseId);

                // Update the exercises state to remove the deleted exercise
                setExercises((prevExercises) =>
                    prevExercises.filter((exercise) => exercise.id !== exerciseId)
                );
            } catch (error) {
                console.error('Error deleting exercise from DB:', error);
            }
        }
    }    

    useEffect(() => {
        if (db) {
            const fetchExercises = async () => {
                const data = await getExerciseData(db);
                setExercises(data || []);
            }

            fetchExercises();
        }
    }, [db]);

    const value = {
        exercises,
        addExerciseToDB,
        deleteExerciseFromDB,
    };

    return (
        <ExerciseContext.Provider value={value}>
            {children}
        </ExerciseContext.Provider>
    );
};
