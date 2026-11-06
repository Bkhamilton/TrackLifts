import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet } from 'react-native';

interface SorenessLegendProps {
    getColor: (intensity: number) => string;
}

const SorenessLegend = ({ getColor }: SorenessLegendProps) => {

    const grayText = useThemeColor({}, 'grayText');

    return (
        <View style={styles.legendContainer}>
            <Text style={[styles.legendTitle, { color: grayText }]}>Time-weighted set exposure:</Text>
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
            <Text style={{ fontSize: 12 }}>Older sets fade by half every 48 hours for this overview. Effort is unknown; easy and hard sets count equally. This is not a recovery clock. Gray means unavailable or unmapped.</Text>
            <View style={styles.legendLabels}>
                <Text style={[styles.legendLabel, { color: grayText }]}>0 units</Text>
                <Text style={[styles.legendLabel, { color: grayText }]}>5 units</Text>
                <Text style={[styles.legendLabel, { color: grayText }]}>10+ units</Text>
            </View>
        </View>
    );
}

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

export default SorenessLegend;
