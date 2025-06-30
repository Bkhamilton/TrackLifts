import { ClearView, Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
    finalTime: string;
    totalSets: number;
    totalWeightMoved: number;
    highestWeight: number;
};

export default function SummaryStatsSection({
    finalTime,
    totalSets,
    totalWeightMoved,
    highestWeight,
}: Props) {
    return (
        <View style={styles.statsContainer}>
            <ClearView style={styles.statRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#666" />
                <Text style={styles.statText}>Time: {finalTime}</Text>
            </ClearView>
            <ClearView style={styles.statRow}>
                <MaterialCommunityIcons name="weight-lifter" size={24} color="#666" />
                <Text style={styles.statText}>Total Sets: {totalSets}</Text>
            </ClearView>
            <ClearView style={styles.statRow}>
                <MaterialCommunityIcons name="weight-pound" size={24} color="#666" />
                <Text style={styles.statText}>Total Weight Moved: {totalWeightMoved} lbs</Text>
            </ClearView>
            <ClearView style={styles.statRow}>
                <MaterialCommunityIcons name="trophy" size={24} color="#666" />
                <Text style={styles.statText}>Highest Weight: {highestWeight} lbs</Text>
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    statText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
});
