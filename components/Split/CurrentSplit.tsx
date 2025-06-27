import { ScrollView, Text, View } from '@/components/Themed';
import { Splits } from '@/constants/types';
import { SplitContext } from '@/contexts/SplitContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface Props {
    currentSplit: Splits | null;
}

const CurrentSplit: React.FC<Props> = ({ currentSplit }) => {

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    const { getCurrentSplitDay } = useContext(SplitContext);

    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

    useEffect(() => {
        const fetchCurrentDay = async () => {
            if (currentSplit) {
                const idx = await getCurrentSplitDay();
                setCurrentDayIndex(idx);
            }
        };
        fetchCurrentDay();
    }, [currentSplit, getCurrentSplitDay]);


    return (
        <View style={styles.currentWeekContainer}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Current Split</Text>
                <Text style={styles.splitName}>{currentSplit?.name || 'No active split'}</Text>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {currentSplit?.routines.map((day) => (
                    <View key={day.day} style={[
                        styles.dayPill,
                        day.routine === 'Rest' && styles.restDayPill,
                        { backgroundColor: cardBackground },
                        { opacity: currentDayIndex >= day.day ? 0.5 : 1 },
                        currentDayIndex + 1 === day.day && { borderColor: '#ff8787', borderWidth: 2 }
                    ]}>
                        <Text style={styles.dayText}>
                            Day {day.day}
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
    )
}

const styles = StyleSheet.create({
    currentWeekContainer: {
        paddingTop: 10,
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    splitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff8787',
    },
    scrollContainer: {
        paddingBottom: 8,
    },
    dayPill: {
        minWidth: 80,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    restDayPill: {
        backgroundColor: 'rgba(245, 245, 245, 0.6)',
    },
    dayText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        marginBottom: 4,
    },
    routineText: {
        fontSize: 14,
        fontWeight: '600',
    },
    restDayText: {
        color: 'rgba(85, 85, 85, 0.6)',
    },
});

export default CurrentSplit;