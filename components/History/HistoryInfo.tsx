import { History } from '@/utils/types';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import HistoryCard from './HistoryCard';

interface HistoryInfoProps {
    open: (history: any) => void;
    data: History[];
}

export default function HistoryInfo({ open, data }: HistoryInfoProps) {
    function getMonthYear(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }

    // Group by month
    const groupedData = data.reduce((acc, history) => {
        const monthYear = getMonthYear(history.startTime);
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(history);
        return acc;
    }, {} as Record<string, History[]>);

    return (
        <View style={styles.container}>
            {Object.entries(groupedData).map(([monthYear, histories]) => (
                <View key={monthYear} style={styles.monthSection}>
                    <Text style={styles.monthHeader}>{monthYear}</Text>
                    <View style={styles.cardsContainer}>
                        {histories.map(history => (
                            <HistoryCard 
                                key={history.id} 
                                history={history} 
                                open={open} 
                            />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
    },
    monthSection: {
        marginBottom: 20,
    },
    monthHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 4,
    },
    cardsContainer: {
        backgroundColor: 'transparent',
    },
});