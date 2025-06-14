import AboutSection from '@/components/Profile/ProfileInfo/AboutSection';
import AvatarUsernameSection from '@/components/Profile/ProfileInfo/AvatarUsernameSection';
import BodyMetricsSection from '@/components/Profile/ProfileInfo/BodyMetricsSection';
import WorkoutStatsSection from '@/components/Profile/ProfileInfo/WorkoutStatsSection';
import { Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookProfileInfo from '@/hooks/useHookProfileInfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileInfoScreen() {
    const router = useRouter();
    const {
        profile,
        isEditing,
        handleEditToggle,
        handleChange,
    } = useHookProfileInfo();

    return (
        <View style={styles.container}>
            <Title 
                title="Profile"
                leftContent={
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/profile/main')}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                    </TouchableOpacity>
                } 
                rightContent={
                    <TouchableOpacity onPress={handleEditToggle}>
                        <Text style={styles.editButton}>
                            {isEditing ? 'Save' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                }
            />
            
            <ScrollView style={styles.scrollContainer}>
                <AvatarUsernameSection
                    avatar={profile.avatar}
                    username={profile.username}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
                <BodyMetricsSection
                    stats={profile.stats}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
                <WorkoutStatsSection
                    stats={profile.stats}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
                <AboutSection
                    stats={profile.stats}
                    isEditing={isEditing}
                    onChange={handleChange}
                />
            </ScrollView>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 12,
    },
    avatar: {
        fontSize: 48,
    },
    username: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 24,
    },
    editableUsername: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        alignSelf: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    editableStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        width: '100%',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    editableInfoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        minWidth: 150,
        textAlign: 'right',
    },
});