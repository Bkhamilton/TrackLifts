// app/contexts/UserContext.tsx
import { User, UserProfileStats } from '@/constants/types';
import { getUserProfileStats } from '@/db/user/UserProfileStats';
import { getUserById } from '@/db/user/Users';
import { saveProfileChanges } from '@/db/user/Profile';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';

interface UserContextValue {
    user: User;
    userStats: UserProfileStats;
    updateUser: (user: User) => void;
    updateUserStats: (stats: UserProfileStats) => void;
    profileStatus: 'loading' | 'ready' | 'error';
    profileError: string | null;
    reloadProfile: () => void;
    saveProfile: (changes: { username?: string; stats?: Partial<UserProfileStats> }) => Promise<void>;
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
        createdAt: '',
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
    profileStatus: 'loading',
    profileError: null,
    reloadProfile: () => {},
    saveProfile: async () => { throw new Error('Profile is not ready.'); },
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
        createdAt: '',
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
    const [profileLoad, setProfileLoad] = useState<{
        connection: typeof db;
        status: UserContextValue['profileStatus'];
        error: string | null;
    }>({ connection: null, status: 'loading', error: null });
    const profileStatus = profileLoad.connection === db ? profileLoad.status : 'loading';
    const profileError = profileLoad.connection === db ? profileLoad.error : null;
    const [loadVersion, setLoadVersion] = useState(0);
    const reloadProfile = () => {
        setProfileLoad({ connection: db, status: 'loading', error: null });
        setLoadVersion(version => version + 1);
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
    };

    const updateUserStats = (newStats: UserProfileStats) => {
        setUserStats(newStats);
    };

    useEffect(() => {
        let current = true;
        if (db) {
            const load = async () => {
                try {
                    const [loadedUser, stats] = await Promise.all([
                        getUserById(db, 1), getUserProfileStats(db, 1),
                    ]);
                    if (!loadedUser || !stats) throw new Error('User profile is unavailable.');
                    if (current) {
                        setUser(loadedUser);
                        setUserStats(stats);
                        setProfileLoad({ connection: db, status: 'ready', error: null });
                    }
                } catch {
                    if (current) {
                        setProfileLoad({
                            connection: db, status: 'error',
                            error: 'Unable to load your profile. Please retry.',
                        });
                    }
                }
            };
            void load();
        }
        return () => { current = false; };
    }, [db, loadVersion]);

    const saveProfile: UserContextValue['saveProfile'] = async (changes) => {
        if (profileStatus !== 'ready' || !user.id) throw new Error('Profile is not ready.');
        const saved = await saveProfileChanges(db, user.id, changes);
        setUser(saved.user);
        setUserStats(saved.stats);
    };

    const value = {
        user,
        userStats,
        updateUser,
        updateUserStats,
        profileStatus,
        profileError,
        reloadProfile,
        saveProfile,
        appearancePreference,
        setAppearancePreference,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
