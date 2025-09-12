import { ClearView, Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
// import WeeklyWorkoutFrequency from './Graphs/WeeklyWorkoutFrequency';

interface WorkoutStats {
    streak: number;
    frequency: string;
    lastWorkout: string;
    totalWorkouts: number;
    caloriesBurned: number;
}

interface WeeklyWorkoutProps {
    weeklyFrequency: {
        workout_date: string;
        session_count: number;
    }[];
}

interface DataHeaderProps {
    stats: WorkoutStats;
    weeklyFrequency: WeeklyWorkoutProps['weeklyFrequency'];
}

export default function DataHeader({ stats, weeklyFrequency } : DataHeaderProps) {
    // Provide default/fallback values to prevent undefined errors
    const safeStats = stats || {
        streak: 0,
        frequency: '--',
        lastWorkout: '--',
        totalWorkouts: 0,
        caloriesBurned: 0,
    };
    const safeWeeklyFrequency = Array.isArray(weeklyFrequency) ? weeklyFrequency : [];


    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    const grayText = useThemeColor({}, 'grayText');
    
    return (
        <View style={[styles.header, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
            <ClearView style={styles.statsRow}>
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="fire" size={20} color="#ff6b6b" />
                    <Text style={styles.statValue}>{safeStats.streak} Day</Text>
                    <Text style={[styles.statLabel, { color: grayText }]}>Streak</Text>
                </ClearView>
                
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="calendar" size={20} color="#4dabf7" />
                    <Text style={styles.statValue}>{safeStats.frequency}</Text>
                    <Text style={[styles.statLabel, { color: grayText }]}>Frequency</Text>
                </ClearView>
                
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="clock" size={20} color="#51cf66" />
                    <Text style={styles.statValue}>{safeStats.lastWorkout}</Text>
                    <Text style={[styles.statLabel, { color: grayText }]}>Last Workout</Text>
                </ClearView>
            </ClearView>

            <View
                style={{
                    backgroundColor: '#ffe066',
                    borderRadius: 8,
                    padding: 10,
                    marginVertical: 10,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#fab005',
                }}
            >
                <Text
                    style={{
                        color: '#212529',
                        fontWeight: 'bold',
                        fontSize: 14,
                        textAlign: 'center',
                    }}
                >
                    Graphing features are temporarily unavailable. Required packages are not yet updated for the current SDK.
                </Text>
            </View>

            {/* <WeeklyWorkoutFrequency
                data={safeWeeklyFrequency}
            /> */}
            
            <ClearView style={styles.summaryRow}>
                <ClearView style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{safeStats.totalWorkouts}</Text>
                    <Text style={[styles.summaryLabel, { color: grayText }]}>Total Workouts</Text>
                </ClearView>
                <ClearView style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{safeStats.caloriesBurned || 0}</Text>
                    <Text style={[styles.summaryLabel, { color: grayText }]}>Calories Burned</Text>
                </ClearView>
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 4,
    },
    statValue: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
});
