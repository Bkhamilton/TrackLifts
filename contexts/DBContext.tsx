// app/contexts/DBContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getMuscles } from '@/db/general/Muscles';
import { getUserProfileStats } from '@/db/user/UserProfileStats';
import { getUserById } from '@/db/user/Users';
import { MuscleGroup, UserProfileStats } from '@/utils/types';
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
    equipment: any[];
    muscles: any[];
    muscleGroups: MuscleGroup[];
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
    equipment: [],
    muscles: [],
    muscleGroups: [],
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

    const [equipment, setEquipment] = useState<any[]>([]);
    const [muscles, setMuscles] = useState<any[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

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
        equipment,
        muscles,
        muscleGroups,
        updateUser,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};
