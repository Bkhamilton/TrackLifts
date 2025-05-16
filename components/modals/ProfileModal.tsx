import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView, Text, View } from '../Themed';

interface ProfileModalProps {
    visible: boolean;
    close: () => void;
}

export default function ProfileModal({ visible, close }: ProfileModalProps) {
    // Hardcoded profile data (replace with your actual data later)
    const profileData = {
        username: 'benkhamilton',
        avatar: '👤', // You can replace this with an actual image
        stats: {
            height: '6\'0"',
            weight: '200 lbs',
            bodyFat: '15%',
            workoutsCompleted: 128,
            weeklyWorkouts: 5,
            weeklySets: 45,
            favoriteExercise: 'Bench Press',
            memberSince: 'Jan 2023',
            goals: 'Build muscle & improve endurance'
        },
        achievements: [
            '3 Week Streak',
            '100 Workouts',
            'Early Bird (5am workouts)'
        ]
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Profile</Text>
                        <TouchableOpacity onPress={close} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {/* Profile Section */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatar}>{profileData.avatar}</Text>
                            </View>
                            <Text style={styles.username}>{profileData.username}</Text>
                            <Text style={styles.memberSince}>Member since {profileData.stats.memberSince}</Text>
                        </View>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.height}</Text>
                                <Text style={styles.statLabel}>Height</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.weight}</Text>
                                <Text style={styles.statLabel}>Weight</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.bodyFat}</Text>
                                <Text style={styles.statLabel}>Body Fat</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.workoutsCompleted}</Text>
                                <Text style={styles.statLabel}>Workouts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.weeklyWorkouts}</Text>
                                <Text style={styles.statLabel}>Weekly</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData.stats.weeklySets}</Text>
                                <Text style={styles.statLabel}>Sets/Week</Text>
                            </View>
                        </View>

                        {/* Additional Info */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Favorite Exercise:</Text>
                                <Text style={styles.infoValue}>{profileData.stats.favoriteExercise}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Current Goals:</Text>
                                <Text style={styles.infoValue}>{profileData.stats.goals}</Text>
                            </View>
                        </View>

                        {/* Achievements */}
                        <View style={styles.achievementsSection}>
                            <Text style={styles.sectionTitle}>Achievements</Text>
                            <View style={styles.achievementsContainer}>
                                {profileData.achievements.map((achievement, index) => (
                                    <View key={index} style={styles.achievementBadge}>
                                        <Text style={styles.achievementText}>{achievement}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPopup: {
        width: '90%',
        height: '70%',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        fontSize: 40,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    memberSince: {
        fontSize: 14,
        color: '#666',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: '600',
        width: 100,
        color: '#555',
    },
    infoValue: {
        flex: 1,
        color: '#333',
    },
    achievementsSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    achievementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    achievementBadge: {
        backgroundColor: '#e3f2fd',
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    achievementText: {
        fontSize: 12,
        color: '#007AFF',
    },
});