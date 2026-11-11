import { UserProfileStats } from '@/constants/types';
import { DataContext } from '@/contexts/DataContext';
import { UserContext } from '@/contexts/UserContext';
import { useContext, useRef, useState } from 'react';

interface ProfileDraft {
    username?: string;
    stats?: Partial<UserProfileStats>;
}

const statFields: (keyof UserProfileStats)[] = [
    'height', 'weight', 'bodyFat', 'favoriteExercise', 'memberSince', 'goals',
];

export default function useHookProfileInfo() {
    const { user, userStats, profileStatus, profileError, reloadProfile, saveProfile } = useContext(UserContext);
    const { weeklySetsCount, topExercise, workoutCount } = useContext(DataContext);
    const [draft, setDraft] = useState<ProfileDraft | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const saving = useRef(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [aboutIsEditing, setAboutIsEditing] = useState(false);
    const aboutEntry = useRef<{ draft: ProfileDraft | null; error: string | null } | null>(null);
    const isEditing = draft !== null;
    const isReady = profileStatus === 'ready';

    // Untouched fields and readonly summaries always come from current providers.
    const profile = {
        username: draft?.username ?? user.username,
        avatar: '👤',
        createdAt: user.createdAt,
        stats: { ...userStats, ...draft?.stats },
        workoutStats: {
            workoutsCompleted: workoutCount.total,
            weeklyWorkouts: workoutCount.weekly,
            weeklySets: weeklySetsCount,
            topExercise: topExercise ? topExercise.title : 'N/A',
        },
    };

    const handleCancel = () => {
        if (saving.current) return;
        setDraft(null);
        setSaveError(null);
    };

    const handleEditToggle = async () => {
        if (!isReady || saving.current) return;
        if (draft === null) {
            setDraft({});
            setSaveError(null);
            return;
        }
        saving.current = true;
        setIsSaving(true);
        setSaveError(null);
        try {
            await saveProfile(draft);
            setDraft(null);
        } catch {
            setSaveError('Unable to save your profile. Your changes are still here; please retry or cancel.');
        } finally {
            saving.current = false;
            setIsSaving(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        if (!isReady || saving.current) return;
        if (field === 'username') {
            setDraft(previous => previous === null ? null : { ...previous, username: value });
        } else {
            const key = statFields.find(key => field === `stats.${key}`);
            if (key) {
                setDraft(previous => previous === null ? null : {
                    ...previous, stats: { ...previous.stats, [key]: value },
                });
            }
        }
    };

    const openAboutModal = () => {
        if (saving.current || aboutModalVisible) return;
        aboutEntry.current = { draft, error: saveError };
        setAboutIsEditing(draft !== null);
        setAboutModalVisible(true);
    };

    const closeAboutModal = () => {
        if (saving.current) return;
        const entry = aboutEntry.current;
        if (entry) {
            setDraft(entry.draft);
            setSaveError(entry.error);
        }
        aboutEntry.current = null;
        setAboutIsEditing(false);
        setAboutModalVisible(false);
    };

    const handleAboutEditToggle = async () => {
        if (!isReady || saving.current || !aboutEntry.current) return;
        if (!aboutIsEditing) {
            setDraft(previous => previous ?? {});
            setAboutIsEditing(true);
            setSaveError(null);
            return;
        }
        saving.current = true;
        setIsSaving(true);
        setSaveError(null);
        try {
            // About saves Goals only; main-screen edits remain a separate pending draft.
            await saveProfile({ stats: { goals: draft?.stats?.goals ?? userStats.goals } });
            const entry = aboutEntry.current;
            if (entry.draft?.stats) {
                const stats = { ...entry.draft.stats };
                delete stats.goals;
                entry.draft = { ...entry.draft, stats };
            }
            setDraft(entry.draft);
            setSaveError(entry.error);
            setAboutIsEditing(false);
        } catch {
            setSaveError('Unable to save Goals. Your changes are still here; please retry or cancel.');
        } finally {
            saving.current = false;
            setIsSaving(false);
        }
    };

    return {
        aboutModalVisible,
        aboutIsEditing,
        openAboutModal,
        closeAboutModal,
        handleAboutEditToggle,
        profile,
        isEditing,
        isSaving,
        isReady,
        profileStatus,
        error: saveError ?? profileError,
        reloadProfile,
        handleEditToggle,
        handleCancel,
        handleChange,
    };
}
