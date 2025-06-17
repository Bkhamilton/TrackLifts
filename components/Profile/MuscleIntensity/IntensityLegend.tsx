import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

const IntensityLegend = ({
    getColor,
}: {
    getColor: (intensity: number) => string;
}) => (
    <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Intensity Scale:</Text>
        <View style={styles.legendBar}>
            {[...Array(10)].map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.legendSegment,
                        { backgroundColor: getColor(i / 9) }
                    ]}
                />
            ))}
        </View>
        <View style={styles.legendLabels}>
            <Text style={styles.legendLabel}>Low</Text>
            <Text style={styles.legendLabel}>Medium</Text>
            <Text style={styles.legendLabel}>High</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    legendContainer: {
        alignItems: 'center',
        marginTop: 2,
        width: '100%',
        borderRadius: 8,
        padding: 8,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#555',
    },
    legendBar: {
        flexDirection: 'row',
        height: 18,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    legendSegment: {
        flex: 1,
    },
    legendLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    legendLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#555',
    },
});

export default IntensityLegend;
