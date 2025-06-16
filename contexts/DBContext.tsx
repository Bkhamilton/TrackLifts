// app/contexts/DBContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { deleteExerciseMuscleByExerciseId, insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { deleteExercise, insertExercise } from '@/db/general/Exercises';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getMuscles } from '@/db/general/Muscles';
import { deleteExerciseSetsByExerciseId } from '@/db/user/ExerciseSets';
import { getUserProfileStats } from '@/db/user/UserProfileStats';
import { getUserById } from '@/db/user/Users';
import { getExerciseData } from '@/utils/exerciseHelpers';
import { Exercise, MuscleGroup, UserProfileStats } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    password: string;
}

interface DBContextValue {
    db: any;
    user: User;
    userStats: UserProfileStats;
    exercises: Exercise[];
    equipment: any[];
    muscles: any[];
    muscleGroups: MuscleGroup[];
    addExerciseToDB: (exercise: Exercise) => Promise<number | undefined>;
    deleteExerciseFromDB: (exerciseId: number) => Promise<void>;
    updateUser: (user: User) => void;
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    user: {
        id: 0,
        username: '',
        name: '',
        email: '',
        password: '',
    },
    userStats: {
        height: "0'0\"",
        weight: "0 lbs",
        bodyFat: "0%",
        favoriteExercise: "Bench Press",
        memberSince: "Jan 2023",
        goals: "Build muscle & endurance"
    },
    exercises: [],
    equipment: [],
    muscles: [],
    muscleGroups: [],
    addExerciseToDB: async () => {
        return undefined;
    },
    deleteExerciseFromDB: async () => {
        return;
    },
    updateUser: () => {
        // This function can be used to update the user if needed
    },
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [user, setUser] = useState<User>({
        id: 0,
        username: '',
        name: '',
        email: '',
        password: '',
    });
    const [userStats, setUserStats] = useState<UserProfileStats>({
        height: "0'0\"",
        weight: "0 lbs",
        bodyFat: "0%",
        favoriteExercise: "Bench Press",
        memberSince: "Jan 2023",
        goals: "Build muscle & endurance"
    });

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [muscles, setMuscles] = useState<any[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

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

    const updateUser = (newUser: User) => {
        setUser(newUser);
    }

    useEffect(() => {
        if (db) {
            getUserById(db, 1).then((data) => {
                setUser(data);
            });
            getEquipment(db).then((data) => {
                setEquipment(data);
            });
            getMuscleGroups(db).then((data) => {
                setMuscleGroups(data);
            });
            getMuscles(db).then((data) => {
                setMuscles(data);
            });
        }
    }, [db]);

    useEffect(() => {
        if (db) {
            const fetchExercises = async () => {
                const data = await getExerciseData(db);
                setExercises(data || []);
            }

            fetchExercises();
        }
    }, [db]);

    useEffect(() => {
        if (db && user.id !== 0) {
            const fetchUserStats = async () => {
                const data = await getUserProfileStats(db, user.id);
                setUserStats(data);
            }
            fetchUserStats();
        }
    }, [db, user]);

    const value = {
        db,
        user,
        userStats,
        exercises,
        equipment,
        muscles,
        muscleGroups,
        addExerciseToDB,
        deleteExerciseFromDB,
        updateUser,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};
