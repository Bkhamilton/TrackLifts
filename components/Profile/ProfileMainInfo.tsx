import { DataContext } from '@/contexts/DataContext';
import { UserContext } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

interface ProfileMainInfoProps {
    avatar: string;
}

export default function ProfileMainInfo({
    avatar = '👤',
}: ProfileMainInfoProps) {

    const { user, userStats } = useContext(UserContext);

    const { workoutCount } = useContext(DataContext);

    const router = useRouter();

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    const handleEditProfile = () => {
        router.replace('/(tabs)/profile/profileInfo');
    };

    return (
        <View style={styles.container}>
            {/* Profile Header Row */}
            <View style={styles.profileHeader}>
                <View style={[styles.avatarContainer, { backgroundColor: cardBackground }]}>
                    <Text style={styles.avatar}>{avatar}</Text>
                </View>
                <View style={styles.profileText}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.memberSince}>Member since {userStats.memberSince}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleEditProfile}
                >
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={[styles.outerStatGrid, { backgroundColor: cardBackground }]}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.height}</Text>
                        <Text style={styles.statLabel}>Height</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStats.weight}</Text>
                        <Text style={styles.statLabel}>Weight</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{workoutCount.total}</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatar: {
        fontSize: 28,
    },
    profileText: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    memberSince: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    outerStatGrid: {
        borderRadius: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    statItem: {
        width: '30%',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 8,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ff8787',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    metaItem: {
        width: '48%',
        padding: 8,
        backgroundColor: 'transparent',
    },
    metaLabel: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
});