import { OnboardingData } from '@/constants/types';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { updateUserProfileStats } from '@/db/user/UserProfileStats';
import { updateUser } from '@/db/user/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';

export default function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { db } = useContext(DBContext);
    const { user, updateUser: updateUserContext, updateUserStats } = useContext(UserContext);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
                const isFirstLaunch = await AsyncStorage.getItem('firstLaunch');
                
                // If this is not the first launch (existing user), skip onboarding
                if (isFirstLaunch === 'false' && hasCompletedOnboarding === null) {
                    // Mark onboarding as completed for existing users
                    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
                    setShowOnboarding(false);
                } else if (hasCompletedOnboarding === null) {
                    // Show onboarding only for new users who haven't completed it
                    setShowOnboarding(true);
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboardingStatus();
    }, []);

    const handleOnboardingComplete = async (data: OnboardingData) => {
        try {
            if (!db || !user.id) {
                console.error('Database or user not available');
                throw new Error('Unable to initialize user profile. Please restart the app and try again.');
            }

            // Update user info
            const updatedUser = {
                ...user,
                name: data.name,
                username: data.username,
            };
            await updateUser(db, updatedUser);
            updateUserContext(updatedUser);

            // Get current date for memberSince
            const memberSince = new Date().toISOString().split('T')[0];

            // Update user profile stats
            const stats = {
                height: data.height,
                weight: data.weight,
                bodyFat: data.bodyFat,
                favoriteExercise: data.favoriteExercise,
                memberSince: memberSince,
                goals: '',
            };
            await updateUserProfileStats(db, user.id, stats);
            updateUserStats(stats);

            // Mark onboarding as completed
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            setShowOnboarding(false);
        } catch (error) {
            console.error('Error completing onboarding:', error);
            throw error; // Propagate error to modal
        }
    };

    return {
        showOnboarding,
        isLoading,
        handleOnboardingComplete,
    };
}
