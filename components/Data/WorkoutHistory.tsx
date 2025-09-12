import { Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
// import MonthlyWorkoutFrequency from './Graphs/MonthlyWorkoutFrequency';

interface WorkoutHistoryProps {
    data: { workout_date: string; session_count: number }[];
}

export default function WorkoutHistory({ data }: WorkoutHistoryProps) {

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const borderColor = useThemeColor({}, 'grayBorder');

    const { workoutCount } = useContext(DataContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout History</Text>
            <View style={{ backgroundColor: backgroundColor, borderRadius: 12, paddingVertical: 8, marginBottom: 16 }}>
                {/* <MonthlyWorkoutFrequency
                    data={data}
                /> */}
            </View>
            
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{workoutCount.monthly}</Text>
                    <Text style={styles.statLabel}>This Month</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{workoutCount.quarterly}</Text>
                    <Text style={styles.statLabel}>Last 3 Months</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{workoutCount.yearly}</Text>
                    <Text style={styles.statLabel}>This Year</Text>
                </View>
            </View>
        </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    graphPlaceholder: {
        backgroundColor: '#f1f3f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        fontSize: 16,
        color: '#868e96',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        flex: 1,
        marginHorizontal: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        color: '#868e96',
        marginTop: 4,
    },
});