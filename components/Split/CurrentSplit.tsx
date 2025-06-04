import { ScrollView, Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Day {
    routine: string;
}

interface Props {
    currentWeek: Day[];
}

const CurrentSplit: React.FC<Props> = ({ currentWeek }) => (
    <View style={styles.currentWeekContainer}>
        <Text style={styles.sectionTitle}>CURRENT SPLIT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentWeek.map((day, index) => (
                <View key={index} style={[
                    styles.dayPill,
                    day.routine === 'Rest' && styles.restDayPill
                ]}>
                    <Text style={styles.dayText}>
                        {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][index]}
                    </Text>
                    <Text style={[
                        styles.routineText,
                        day.routine === 'Rest' && styles.restDayText
                    ]}>
                        {day.routine}
                    </Text>
                </View>
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    currentWeekContainer: {
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    dayPill: {
        width: 80,
        padding: 8,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    restDayPill: {
        backgroundColor: 'rgba(240, 240, 240, 0.6)',
    },
    dayText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
    routineText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    restDayText: {
        color: 'rgba(85, 85, 85, 0.6)',
    },
});

export default CurrentSplit;
