import { ClearView, Text } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { calculateLastWorkout, calculateStreak } from '@/utils/dataCalculations';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ComponentProps, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileInsightsCard() {
    const router = useRouter();

    const { workoutFrequency } = useContext(WorkoutContext);
    const { workoutCount } = useContext(DataContext);

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    const grayText = useThemeColor({}, 'grayText');
    
    // Sample data - replace with your actual data
    const progressData = {
        workoutsThisWeek: workoutCount.weekly, // e.g., 3 workouts
        progressPercentage: 0, // % increase from last week
        streak: calculateStreak(workoutFrequency), // days
        caloriesBurned: 0, // weekly total
        lastWorkout: calculateLastWorkout(workoutFrequency), // e.g., "2 days ago"
        totalWeightThisWeek: 12500,            // kg lifted this week
        averageDuration: 45,                  // minutes per session
        activeDaysThisMonth: workoutCount.monthly,        
    };

    // Helper: Score each stat for noteworthiness
    function getStatScore(stat: { key: string, value: number }) {
        switch (stat.key) {
            case 'streak':
                return stat.value >= 7 ? 100 + stat.value : stat.value; // highlight long streaks
            case 'progressPercentage':
                return Math.abs(stat.value); // highlight big changes
            case 'totalWeightThisWeek':
                return stat.value;
            case 'averageDuration':
                return stat.value;
            case 'workoutsThisWeek':
                return stat.value;
            case 'activeDaysThisMonth':
                return stat.value;
            default:
                return 0;
        }
    }

    // Build all possible stats
    const allStats = [
        {
            key: 'workoutsThisWeek',
            icon: 'calendar-check' as const,
            value: progressData.workoutsThisWeek,
            label: 'Workouts this week',
            color: '#4dabf7',
        },
        {
            key: 'activeDaysThisMonth',
            icon: 'calendar-month' as const,
            value: progressData.activeDaysThisMonth,
            label: 'Active days (mo)',
            color: '#845ef7',
        },
        {
            key: 'streak',
            icon: 'fire' as const,
            value: progressData.streak,
            label: 'Day streak',
            color: '#ff6b6b',
        },
        {
            key: 'progressPercentage',
            icon: 'trending-up' as const,
            value: progressData.progressPercentage,
            label: 'Strength progress',
            color: '#51cf66',
        },
        {
            key: 'totalWeightThisWeek',
            icon: 'dumbbell' as const,
            value: progressData.totalWeightThisWeek,
            label: 'Weight lifted',
            color: '#74c0fc',
        },
        {
            key: 'averageDuration',
            icon: 'timer-outline' as const,
            value: progressData.averageDuration,
            label: 'Avg duration',
            color: '#fcc419',
        },
    ];

    // Remove one of the weekly/monthly if both are present, keep the higher
    let filteredStats = allStats;
    if (progressData.workoutsThisWeek >= progressData.activeDaysThisMonth) {
        filteredStats = allStats.filter(stat => stat.key !== 'activeDaysThisMonth');
    } else {
        filteredStats = allStats.filter(stat => stat.key !== 'workoutsThisWeek');
    }    

    // Score, sort, and pick top 4
    const displayedStats = filteredStats
        .map(stat => ({ ...stat, score: getStatScore(stat) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);    

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
                {displayedStats.map(({ icon, value, label, color, key }) => (
                    <StatItem
                        key={key}
                        icon={icon}
                        value={typeof value === 'number' ? value.toString() : value}
                        label={label}
                        color={color}
                    />
                ))}         
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

    const grayText = useThemeColor({}, 'grayText');

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
                <Text style={[styles.statLabel, { color: grayText }]}>{label}</Text>
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