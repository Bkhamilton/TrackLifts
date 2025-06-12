import { ClearView, Text, View } from '@/components/Themed';
import { Splits } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    splits: Splits[];
    setShowCreateModal: (show: boolean) => void;
    setAsPrimary: (id: number) => void;
    setEditingSplit: (split: Splits) => void;
}

const YourSplits: React.FC<Props> = ({
    splits,
    setShowCreateModal,
    setAsPrimary,
    setEditingSplit,
}) => (
    <View style={styles.splitsContainer}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>YOUR SPLITS</Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowCreateModal(true)}
            >
                <MaterialCommunityIcons name="plus" size={20} color="#ff8787" />
            </TouchableOpacity>
        </View>

        <FlatList
            data={splits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={[
                    styles.splitCard,
                    item.is_active && styles.primarySplitCard
                ]}>
                    <View style={styles.splitHeader}>
                        <Text style={styles.splitName}>{item.name}</Text>
                        <View style={styles.splitActions}>
                            {!item.is_active && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => setAsPrimary(item.id)}
                                >
                                    <Text style={styles.actionText}>Set as Primary</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setEditingSplit(item)}
                            >
                                <MaterialCommunityIcons name="pencil" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <ClearView style={styles.splitDays}>
                        {item.routines.map((day, index) => (
                            <ClearView key={index} style={styles.splitDayItem}>
                                <Text style={styles.dayLabel}>
                                    {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'][day.day - 1]}
                                </Text>
                                <Text style={styles.routineLabel}>
                                    {day.routine}
                                </Text>
                            </ClearView>
                        ))}
                    </ClearView>
                </View>
            )}
        />
    </View>
);

const styles = StyleSheet.create({
    splitsContainer: {
        flex: 1,
        paddingHorizontal: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addButton: {
        padding: 4,
    },
    splitCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    primarySplitCard: {
        borderWidth: 1,
        borderColor: '#ff8787',
    },
    splitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    splitName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    splitActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 12,
    },
    actionText: {
        color: '#ff8787',
        fontSize: 12,
    },
    splitDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    splitDayItem: {
        width: '14%',
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#666',
    },
    routineLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
});

export default YourSplits;
