import { History } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ClearView, Text, View } from '../Themed';
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

    if (!data || data.length === 0) {
        return (
            <ClearView style={[styles.cardContainer, styles.emptyCard]}>
                <MaterialCommunityIcons 
                    name="history" 
                    size={24} 
                    color="#ccc" 
                    style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>No workout history yet</Text>
                <Text style={styles.emptySubtext}>Your completed workouts will appear here</Text>
            </ClearView>
        );
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
    emptyCard: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    cardContainer: {
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },    
});