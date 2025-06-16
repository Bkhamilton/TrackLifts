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
        workoutsCompleted: number;
        weeklyWorkouts: number;
        weeklySets: number;
        favoriteExercise: string;
        memberSince: string;
        goals: string;
    };
}

export default function useHookProfileInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const { db } = useContext(DBContext);
    const { user, userStats, updateUser } = useContext(UserContext);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const openAboutModal = () => setAboutModalVisible(true);
    const closeAboutModal = () => setAboutModalVisible(false);

    const [profile, setProfile] = useState<ProfileData>({
        username: user.username || 'benkhamilton',
        avatar: '👤',
        stats: {
            height: userStats.height || '6\'2"',
            weight: userStats.weight || '180 lbs',
            bodyFat: userStats.bodyFat || '15%',
            workoutsCompleted: 128,
            weeklyWorkouts: 5,
            weeklySets: 45,
            favoriteExercise: userStats.favoriteExercise || 'Squats',
            memberSince: userStats.memberSince || 'Jan 2022',
            goals: userStats.goals || 'Build Strength'
        },
    });

    const handleSave = () => {
        setIsEditing(false);
        if (profile.username !== user.username) {
            updateUsername(db, user.id, profile.username);
            updateUser({ ...user, username: profile.username });
        }
        updateUserProfileStats(db, user.id, {
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
            handleSave();
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
