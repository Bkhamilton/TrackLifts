import { Text, View } from '@/components/Themed';
import { History } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface HistoryCardProps {
    history: History;
    open: (history: any) => void;
}

export default function HistoryCard({ history, open }: HistoryCardProps) {

    function convertTime(timeStr: string) {
        // Accepts "MM:SS", "HH:MM:SS", or "DD:HH:MM:SS"
        const parts = timeStr.split(':').map(Number);
        let days = 0, hours = 0, minutes = 0, seconds = 0;

        if (parts.length === 2) {
            // MM:SS
            [minutes, seconds] = parts;
        } else if (parts.length === 3) {
            // HH:MM:SS
            [hours, minutes, seconds] = parts;
        } else if (parts.length === 4) {
            // DD:HH:MM:SS
            [days, hours, minutes, seconds] = parts;
        }

        let result = '';
        if (days > 0) result += `${days}d `;
        if (hours > 0 || days > 0) result += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
        result += `${seconds}s`;

        return result.trim();
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    return (
        <TouchableOpacity onPress={() => open(history)}>
            <View style={styles.cardContainer}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{formatDate(history.startTime)}</Text>
                </View>
                
                <View style={styles.contentContainer}>
                    <Text style={styles.routineTitle}>{history.routine.title}</Text>
                    
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons 
                                name="clock-outline" 
                                size={16} 
                                color="#ff8787" 
                                style={styles.icon}
                            />
                            <Text style={styles.statText}>{convertTime(history.lengthMin)}</Text>
                        </View>
                        
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons 
                                name="weight-pound" 
                                size={16} 
                                color="#ff8787" 
                                style={styles.icon}
                            />
                            <Text style={styles.statText}>{history.totalWeight} lbs</Text>
                        </View>
                    </View>
                </View>
                
                <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={20} 
                    color="#ccc" 
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dateContainer: {
        backgroundColor: '#ff8787',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginRight: 12,
        minWidth: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    contentContainer: {
        flex: 1,
    },
    routineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    statsContainer: {
        flexDirection: 'row',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        marginRight: 4,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
});