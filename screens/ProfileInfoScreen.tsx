import { Text, TextInput, View } from '@/components/Themed';
import Title from '@/components/Title';
import { DBContext } from '@/contexts/DBContext';
import { updateUserProfileStats } from '@/db/user/UserProfileStats';
import { updateUsername } from '@/db/user/Users';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

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

export default function ProfileInfoScreen() {
    const [isEditing, setIsEditing] = useState(false);

    const { db, user, userStats } = useContext(DBContext);

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

    const router = useRouter();

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to your backend/database

        if (profile.username !== user.username) {
            // Update username in the database
            updateUsername(db, user.id, profile.username);
        }

        updateUserProfileStats(db, user.id, {
            height: profile.stats.height,
            weight: profile.stats.weight,
            bodyFat: profile.stats.bodyFat,
            favoriteExercise: profile.stats.favoriteExercise,
            memberSince: profile.stats.memberSince,
            goals: profile.stats.goals
        });
        console.log('Saved profile:', profile);
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
                // fallback: don't update if not an object
                return prev;
            }
            return {
                ...prev,
                [field]: value
            };
        });
    };

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
                {/* Avatar & Username Section */}
                <View style={styles.section}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{profile.avatar}</Text>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={styles.editableUsername}
                            value={profile.username}
                            onChangeText={(value) => handleChange('username', value)}
                        />
                    ) : (
                        <Text style={styles.username}>{profile.username}</Text>
                    )}
                </View>
                
                {/* Basic Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Body Metrics</Text>
                    <View style={styles.statsGrid}>
                        <EditableStatCard 
                            label="Height" 
                            value={profile.stats.height} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.height', value)}
                        />
                        <EditableStatCard 
                            label="Weight" 
                            value={profile.stats.weight} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.weight', value)}
                        />
                        <EditableStatCard 
                            label="Body Fat" 
                            value={profile.stats.bodyFat} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.bodyFat', value)}
                        />
                    </View>
                </View>
                
                {/* Workout Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Workout Stats</Text>
                    <View style={styles.statsGrid}>
                        <EditableStatCard 
                            label="Workouts" 
                            value={profile.stats.workoutsCompleted.toString()} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.workoutsCompleted', value)}
                        />
                        <EditableStatCard 
                            label="Weekly Workouts" 
                            value={profile.stats.weeklyWorkouts.toString()} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.weeklyWorkouts', value)}
                        />
                        <EditableStatCard 
                            label="Weekly Sets" 
                            value={profile.stats.weeklySets.toString()} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.weeklySets', value)}
                        />
                        <EditableStatCard 
                            label="Favorite Exercise" 
                            value={profile.stats.favoriteExercise} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.favoriteExercise', value)}
                        />
                    </View>
                </View>
                
                {/* Membership & Goals Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.infoCard}>
                        <EditableInfoRow 
                            label="Member Since" 
                            value={profile.stats.memberSince} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.memberSince', value)}
                        />
                        <EditableInfoRow 
                            label="Goals" 
                            value={profile.stats.goals} 
                            isEditing={isEditing}
                            onChange={(value) => handleChange('stats.goals', value)}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// Updated Stat Card Component with Edit Support
function EditableStatCard({ 
    label, 
    value, 
    isEditing, 
    onChange 
}: { 
    label: string; 
    value: string; 
    isEditing: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <View style={styles.statCard}>
            {isEditing ? (
                <TextInput
                    style={styles.editableStatValue}
                    value={value}
                    onChangeText={onChange}
                />
            ) : (
                <Text style={styles.statValue}>{value}</Text>
            )}
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// Updated Info Row Component with Edit Support
function EditableInfoRow({ 
    label, 
    value, 
    isEditing, 
    onChange 
}: { 
    label: string; 
    value: string; 
    isEditing: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isEditing ? (
                <TextInput
                    style={styles.editableInfoValue}
                    value={value}
                    onChangeText={onChange}
                />
            ) : (
                <Text style={styles.infoValue}>{value}</Text>
            )}
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