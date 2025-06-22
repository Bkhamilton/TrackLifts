import { ClearView, Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import WorkoutFrequencyChart from './Graphs/WorkoutFrequencyChart';

interface WorkoutStats {
  streak: number;
  frequency: string;
  lastWorkout: string;
  totalWorkouts: number;
  caloriesBurned: number;
}

const DataHeader: React.FC<{ stats: WorkoutStats }> = ({ stats }) => {

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <View style={[styles.header, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
            <ClearView style={styles.statsRow}>
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="fire" size={20} color="#ff6b6b" />
                    <Text style={styles.statValue}>{stats.streak} Day</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </ClearView>
                
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="calendar" size={20} color="#4dabf7" />
                    <Text style={styles.statValue}>{stats.frequency}</Text>
                    <Text style={styles.statLabel}>Frequency</Text>
                </ClearView>
                
                <ClearView style={styles.statCard}>
                    <MaterialCommunityIcons name="clock" size={20} color="#51cf66" />
                    <Text style={styles.statValue}>{stats.lastWorkout}</Text>
                    <Text style={styles.statLabel}>Last Workout</Text>
                </ClearView>
            </ClearView>
            
            <WorkoutFrequencyChart/>
            
            <ClearView style={styles.summaryRow}>
                <ClearView style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{stats.totalWorkouts}</Text>
                    <Text style={styles.summaryLabel}>Total Workouts</Text>
                </ClearView>
                <ClearView style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{stats.caloriesBurned.toLocaleString()}</Text>
                    <Text style={styles.summaryLabel}>Calories Burned</Text>
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

export default DataHeader;