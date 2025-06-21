import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

// Hardcoded stat values for demonstration
const stats = [
    { label: 'Top Set', value: '125 lbs x 8 reps' },
    { label: 'Heaviest Set', value: '130 lbs x 4 reps' },
    { label: 'Most Weight Moved', value: '2,000 lbs' },
    { label: 'Average Weight', value: '110 lbs' },
    { label: 'Repetitions', value: '95 lbs x 20 reps' },
];

export default function DataTab() {
    return (
        <View style={styles.dataContainer}>
            <Text style={styles.header}>Exercise Data</Text>
            {stats.map((stat, idx) => (
                <View key={stat.label} style={styles.statRow}>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <View style={styles.valueBox}>
                        <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    dataContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
    },
    header: {
        fontWeight: '500',
        marginBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    statLabel: {
        width: 140,
        fontSize: 14,
    },
    valueBox: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: '#f1f3f5',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    statValue: {
        fontWeight: '600',
        fontSize: 15,
        color: '#ff8787',
    },
});