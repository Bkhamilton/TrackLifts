// app/contexts/UserContext.tsx
import { getUserProfileStats } from '@/db/user/UserProfileStats';
import { getUserById } from '@/db/user/Users';
import { User, UserProfileStats } from '@/utils/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';

interface UserContextValue {
    user: User;
    userStats: UserProfileStats;
    updateUser: (user: User) => void;
    updateUserStats: (stats: UserProfileStats) => void;
    appearancePreference: 'light' | 'dark' | 'system';
    setAppearancePreference: (preference: 'light' | 'dark' | 'system') => void;
}

export const UserContext = createContext<UserContextValue>({
    user: {
        id: 0,
        username: '',
        name: '',
        email: '',
        password: '',
    },
    userStats: {
        height: '',
        weight: '',
        bodyFat: '',
        favoriteExercise: '',
        memberSince: '',
        goals: '',
    },
    updateUser: () => {
        // This function can be used to update the user if needed
    },
    updateUserStats: () => {
        // This function can be used to update the user stats if needed
    },
    appearancePreference: 'system',
    setAppearancePreference: () => {},
});

interface UserContextValueProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextValueProviderProps) => {

    const { db } = useContext(DBContext);

    const [user, setUser] = useState<User>({
        id: 0,
        username: '',
        name: '',
        email: '',
        password: '',
    });
    const [userStats, setUserStats] = useState<UserProfileStats>({
        height: '',
        weight: '',
        bodyFat: '',
        favoriteExercise: '',
        memberSince: '',
        goals: '',
    });
    const [appearancePreference, setAppearancePreference] = useState<'light' | 'dark' | 'system'>('system');

    const updateUser = (newUser: User) => {
        setUser(newUser);
    };

    const updateUserStats = (newStats: UserProfileStats) => {
        setUserStats(newStats);
    };

    useEffect(() => {
        if (db) {
            getUserById(db, 1).then((data) => {
                setUser(data);
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
        user,
        userStats,
        updateUser,
        updateUserStats,
        appearancePreference,
        setAppearancePreference,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
