import { ClearView, Text } from '@/components/Themed';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { calculateLastWorkout, calculateStreak, calculateWeeklyFrequency } from '@/utils/dataCalculations';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileInsightsCard() {
    const router = useRouter();

    const { workoutFrequency } = useContext(WorkoutContext);

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    
    // Sample data - replace with your actual data
    const progressData = {
        workoutsThisWeek: calculateWeeklyFrequency(workoutFrequency).charAt(0), // e.g., 3 workouts
        progressPercentage: 0, // % increase from last week
        streak: calculateStreak(workoutFrequency), // days
        caloriesBurned: 3420, // weekly total
        lastWorkout: calculateLastWorkout(workoutFrequency) // e.g., "2 days ago"
    };

    return (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: cardBackground, borderColor: cardBorder }]}
            onPress={() => router.replace('/(tabs)/profile/data')}
        >
            <ClearView style={styles.header}>
                <ClearView style={styles.titleContainer}>
                    <MaterialCommunityIcons 
                        name="chart-line" 
                        size={24} 
                        color="#ff8787" 
                        style={styles.icon}
                    />
                    <Text style={styles.title}>Progress Insights</Text>
                </ClearView>
                <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color="#aaa" 
                />
            </ClearView>
            
            <ClearView style={styles.statsContainer}>
                <StatItem 
                    icon="calendar-check" 
                    value={`${progressData.workoutsThisWeek}`} 
                    label="Workouts this week" 
                    color="#4dabf7"
                />
                <StatItem 
                    icon="fire" 
                    value={`${progressData.streak}`} 
                    label="Day streak" 
                    color="#ff6b6b"
                />
                <StatItem 
                    icon="trending-up" 
                    value={`+${progressData.progressPercentage}%`} 
                    label="Strength progress" 
                    color="#51cf66"
                />
                <StatItem 
                    icon="lightning-bolt" 
                    value={`${progressData.caloriesBurned.toLocaleString()}`} 
                    label="Calories burned" 
                    color="#ffd43b"
                />
            </ClearView>
            
            <ClearView style={styles.footer}>
                <Text style={styles.linkText}>Tap to view detailed analytics</Text>
            </ClearView>
        </TouchableOpacity>
    );
}

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function StatItem({ icon, value, label, color }: { 
    icon: MaterialCommunityIconName; 
    value: string; 
    label: string;
    color: string;
}) {
    return (
        <ClearView style={styles.statItem}>
            <ClearView style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialCommunityIcons 
                    name={icon} 
                    size={18} 
                    color={color} 
                />
            </ClearView>
            <ClearView style={styles.statTextContainer}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </ClearView>
        </ClearView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginBottom: 8,
    },
    statItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statTextContainer: {
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
        alignItems: 'center',
    },
    linkText: {
        color: '#ff8787',
        fontWeight: '500',
        fontSize: 14,
    },
});