import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';
import WorkoutFrequencyChartMonth from './WorkoutFrequencyChartMonth';

const WorkoutHistory: React.FC = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Workout History</Text>
        
        <View style={{ backgroundColor: '#f1f3f5', borderRadius: 12, paddingVertical: 8, marginBottom: 16 }}>
            <WorkoutFrequencyChartMonth />
        </View>
        
        <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>42</Text>
                <Text style={styles.statLabel}>Last 3 Months</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>This Year</Text>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
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
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#868e96',
        marginTop: 4,
    },
});

export default WorkoutHistory;