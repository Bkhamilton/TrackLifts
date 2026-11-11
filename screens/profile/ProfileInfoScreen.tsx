import AboutModal from '@/components/modals/AboutModal';
import AboutSection from '@/components/Profile/ProfileInfo/AboutSection';
import AvatarUsernameSection from '@/components/Profile/ProfileInfo/AvatarUsernameSection';
import BodyMetricsSection from '@/components/Profile/ProfileInfo/BodyMetricsSection';
import WorkoutStatsSection from '@/components/Profile/ProfileInfo/WorkoutStatsSection';
import { Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookProfileInfo from '@/hooks/profile/useHookProfileInfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileInfoScreen() {
    const router = useRouter();
    const {
        aboutModalVisible,
        aboutIsEditing,
        handleAboutEditToggle,
        openAboutModal,
        closeAboutModal,
        profile,
        isEditing,
        isSaving,
        isReady,
        profileStatus,
        error,
        reloadProfile,
        handleEditToggle,
        handleCancel,
        handleChange,
    } = useHookProfileInfo();

    return (
        <View style={styles.container}>
            <Title 
                title="Profile"
                leftContent={
                    <TouchableOpacity disabled={isSaving} onPress={() => {
                        handleCancel();
                        router.replace('/(tabs)/profile/main');
                    }}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                    </TouchableOpacity>
                } 
                rightContent={
                    <TouchableOpacity onPress={handleEditToggle} disabled={!isReady || isSaving}>
                        <Text style={styles.editButton}>
                            {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                }
            />
            
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}    
            >
                {profileStatus === 'loading' && <Text>Loading profile…</Text>}
                {error && <Text accessibilityRole="alert">{error}</Text>}
                {profileStatus === 'error' && (
                    <TouchableOpacity onPress={reloadProfile}><Text>Retry loading profile</Text></TouchableOpacity>
                )}
                {isEditing && (
                    <TouchableOpacity onPress={handleCancel} disabled={isSaving}><Text>Cancel changes</Text></TouchableOpacity>
                )}
                <AvatarUsernameSection
                    avatar={profile.avatar}
                    username={profile.username}
                    createdAt={profile.createdAt}
                    isEditing={isEditing && !isSaving}
                    onChange={handleChange}
                />
                <BodyMetricsSection
                    stats={profile.stats}
                    isEditing={isEditing && !isSaving}
                    onChange={handleChange}
                />
                <WorkoutStatsSection
                    stats={profile.workoutStats}
                    isEditing={false} // Not editable
                    onChange={() => {}} // No-op
                />
                <AboutSection
                    stats={profile.stats}
                    onPress={openAboutModal}
                />
            </ScrollView>
            <AboutModal
                visible={aboutModalVisible}
                onClose={closeAboutModal}
                stats={profile.stats}
                onChange={handleChange}
                isEditing={aboutIsEditing}
                isSaving={isSaving}
                isReady={isReady}
                error={error}
                onEditToggle={handleAboutEditToggle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 83,
    },
    editButton: {
        color: '#ff8787',
        fontSize: 16,
        fontWeight: '600',
    },
});