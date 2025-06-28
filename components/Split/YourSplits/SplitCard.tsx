import { ClearView, Text, View } from '@/components/Themed';
import { Splits } from '@/constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SplitCardProps {
    item: Splits;
    cardBackground: string;
    cardBorder: string;
    setAsPrimary: (id: number) => void;
    setEditingSplit: (split: number) => void;
    handleDelete: (splitId: number) => void;
}

const SplitCard: React.FC<SplitCardProps> = ({
    item,
    cardBackground,
    cardBorder,
    setAsPrimary,
    setEditingSplit,
    handleDelete,
}) => (
    <View style={[
        styles.splitCard,
        item.is_active && styles.primarySplitCard,
        !item.is_active && { borderColor: cardBorder, borderWidth: 1 },
        { backgroundColor: cardBackground }
    ]}>
        <ClearView style={styles.splitHeader}>
            <ClearView>
                <Text style={styles.splitName}>{item.name}</Text>
                <Text style={styles.dayCount}>
                    {item.routines.length} day{item.routines.length !== 1 ? 's' : ''}
                </Text>
            </ClearView>
            <ClearView style={styles.splitActions}>
                {!item.is_active && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setAsPrimary(item.id)}
                    >
                        <Text style={styles.actionText}>Set Primary</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditingSplit(item.id)}
                >
                    <MaterialCommunityIcons name="pencil" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <MaterialCommunityIcons name="trash-can" size={20} color="#ff8787" />
                </TouchableOpacity>
            </ClearView>
        </ClearView>
        
        <ClearView style={styles.daysContainer}>
            {item.routines.map((day) => (
                <ClearView key={day.day} style={styles.dayItem}>
                    <Text style={styles.dayLabel}>Day {day.day}</Text>
                    <Text style={styles.routineLabel}>{day.routine}</Text>
                </ClearView>
            ))}
        </ClearView>
    </View>
);

const styles = StyleSheet.create({
    splitCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    primarySplitCard: {
        borderWidth: 2,
        borderColor: '#ff8787',
    },
    splitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    splitName: {
        fontSize: 16,
        fontWeight: '600',
    },
    dayCount: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    splitActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 8,
    },
    actionText: {
        color: '#ff8787',
        fontSize: 14,
        fontWeight: '500',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    dayItem: {
        width: '33.33%',
        padding: 8,
        paddingHorizontal: 4,
    },
    dayLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    routineLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SplitCard;
