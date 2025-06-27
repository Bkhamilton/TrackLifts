import { ClearView, Text, View } from '@/components/Themed';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { History } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, } from 'react-native';
import HistoryCard from './HistoryCard';

interface HistoryInfoProps {
    open: (history: any) => void;
    data: History[];
}

// Helper to get the week number of a date
function getWeekNumber(dateString: string) {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getMonthYear(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
}

export default function HistoryInfo({ open, data }: HistoryInfoProps) {

    const { refreshHistory } = useContext(WorkoutContext);

    // Group data by month/year, then by week
    const sections = React.useMemo(() => {
        if (!data || data.length === 0) return [];
        const grouped: Record<string, Record<number, History[]>> = {};
        data.forEach(history => {
            const monthYear = getMonthYear(history.startTime);
            const week = getWeekNumber(history.startTime);
            if (!grouped[monthYear]) grouped[monthYear] = {};
            if (!grouped[monthYear][week]) grouped[monthYear][week] = [];
            grouped[monthYear][week].push(history);
        });
        // Convert to SectionList format
        return Object.entries(grouped).map(([title, weeks]) => ({
            title,
            data: Object.keys(weeks)
                .map(Number)
                .sort((a, b) => b - a)
                .map(weekNum => weeks[weekNum]),
        }));
    }, [data]);

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

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        refreshHistory();
        setRefreshing(false);
    };    

    return (
        <SectionList
            sections={sections}
            keyExtractor={item => item.map(h => h.id).join('-')}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.monthHeader}>{title}</Text>
            )}
            renderItem={({ item }) => (
                <View>
                    {item.map(history => (
                        <HistoryCard 
                            key={history.id}
                            history={history}
                            open={open}
                        />
                    ))}
                </View>
            )}
            contentContainerStyle={styles.container}
            SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // <-- Week separator
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#ff8787']}
                />
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 185,
    },
    monthHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        paddingLeft: 4,
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