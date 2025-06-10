import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

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

const profileData: ProfileData = {
    username: 'benkhamilton',
    avatar: '👤',
    stats: {
        height: '6\'0"',
        weight: '200 lbs',
        bodyFat: '15%',
        workoutsCompleted: 128,
        weeklyWorkouts: 5,
        weeklySets: 45,
        favoriteExercise: 'Bench Press',
        memberSince: 'Jan 2023',
        goals: 'Build muscle & endurance'
    },
};

export default function ProfileInfoScreen() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Title 
                title="Profile" 
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/profile/main');
                        }}
                        style={{ marginRight: 12 }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                }
                rightContent={<Text style={styles.editButton}>Edit</Text>}
            />
            
            <ScrollView style={styles.scrollContainer}>
                {/* Avatar & Username Section */}
                <View style={styles.section}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{profileData.avatar}</Text>
                    </View>
                    <Text style={styles.username}>{profileData.username}</Text>
                </View>
                
                {/* Basic Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Body Metrics</Text>
                    <View style={styles.statsGrid}>
                        <StatCard label="Height" value={profileData.stats.height} />
                        <StatCard label="Weight" value={profileData.stats.weight} />
                        <StatCard label="Body Fat" value={profileData.stats.bodyFat} />
                    </View>
                </View>
                
                {/* Workout Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Workout Stats</Text>
                    <View style={styles.statsGrid}>
                        <StatCard label="Workouts" value={profileData.stats.workoutsCompleted.toString()} />
                        <StatCard label="Weekly Workouts" value={profileData.stats.weeklyWorkouts.toString()} />
                        <StatCard label="Weekly Sets" value={profileData.stats.weeklySets.toString()} />
                        <StatCard label="Favorite Exercise" value={profileData.stats.favoriteExercise} />
                    </View>
                </View>
                
                {/* Membership & Goals Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.infoCard}>
                        <InfoRow label="Member Since" value={profileData.stats.memberSince} />
                        <InfoRow label="Goals" value={profileData.stats.goals} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// Reusable Stat Card Component
function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// Reusable Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
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
        marginBottom: 83
    },
    editButton: {
        color: '#ff8787',
        fontSize: 16,
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
});