import { DataContext } from '@/contexts/DataContext';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { updateUserProfileStats } from '@/db/user/UserProfileStats';
import { updateUsername } from '@/db/user/Users';
import { useContext, useState } from 'react';

interface ProfileData {
    username: string;
    avatar: string;
    stats: {
        height: string;
        weight: string;
        bodyFat: string;
        favoriteExercise: string;
        memberSince: string;
        goals: string;
    };
    workoutStats: {
        workoutsCompleted: number;
        weeklyWorkouts: number;
        weeklySets: number;
        topExercise: string;
    }
}

export default function useHookProfileInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const { db } = useContext(DBContext);
    const { user, userStats, updateUser, updateUserStats } = useContext(UserContext);
    const { totalWorkoutCount, weeklyWorkoutCount, weeklySetsCount, topExercise } = useContext(DataContext);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const openAboutModal = () => setAboutModalVisible(true);
    const closeAboutModal = () => setAboutModalVisible(false);

    const [profile, setProfile] = useState<ProfileData>({
        username: user.username || '',
        avatar: '👤',
        stats: {
            height: userStats.height,
            weight: userStats.weight,
            bodyFat: userStats.bodyFat,
            favoriteExercise: userStats.favoriteExercise,
            memberSince: userStats.memberSince,
            goals: userStats.goals
        },
        workoutStats: {
            workoutsCompleted: totalWorkoutCount,
            weeklyWorkouts: weeklyWorkoutCount,
            weeklySets: weeklySetsCount,
            topExercise: topExercise ? topExercise.title : 'N/A'
        }
    });

    const handleSave = () => {
        setIsEditing(false);
        if (profile.username !== user.username) {
            updateUsername(db, user.id, profile.username);
            updateUser({ ...user, username: profile.username });
        }
        updateUserProfileStats(db, user.id, profile.stats);
        updateUserStats({
            ...userStats,
            height: profile.stats.height,
            weight: profile.stats.weight,
            bodyFat: profile.stats.bodyFat,
            favoriteExercise: profile.stats.favoriteExercise,
            memberSince: profile.stats.memberSince,
            goals: profile.stats.goals
        });
        // Optionally: console.log('Saved profile:', profile);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // If no changes were made, just toggle editing state
            if (JSON.stringify(profile.stats) === JSON.stringify(userStats) && profile.username === user.username) {
                setIsEditing(false);
            } else {
                handleSave();
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleChange = (field: string, value: string) => {
        setProfile(prev => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                const parentValue = prev[parent as keyof ProfileData];
                if (typeof parentValue === 'object' && parentValue !== null) {
                    return {
                        ...prev,
                        [parent]: {
                            ...parentValue,
                            [child]: value
                        }
                    };
                }
                return prev;
            }
            return {
                ...prev,
                [field]: value
            };
        });
    };

    return {
        aboutModalVisible,
        openAboutModal,
        closeAboutModal,
        profile,
        isEditing,
        handleEditToggle,
        handleChange,
    };
}
