import { Text, View } from '@/components/Themed';
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
            <Text style={styles.sectionTitle}>Your Splits</Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowCreateModal(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
            </TouchableOpacity>
        </View>

        <FlatList
            data={splits}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 85 }}
            renderItem={({ item }) => (
                <View style={[
                    styles.splitCard,
                    item.is_active && styles.primarySplitCard
                ]}>
                    <View style={styles.splitHeader}>
                        <View>
                            <Text style={styles.splitName}>{item.name}</Text>
                            <Text style={styles.dayCount}>
                                {item.routines.length} day{item.routines.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                        <View style={styles.splitActions}>
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
                                onPress={() => setEditingSplit(item)}
                            >
                                <MaterialCommunityIcons name="pencil" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.daysContainer}>
                        {item.routines.map((day) => (
                            <View key={day.day} style={styles.dayItem}>
                                <Text style={styles.dayLabel}>Day {day.day}</Text>
                                <Text style={styles.routineLabel}>{day.routine}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        />
    </View>
);

const styles = StyleSheet.create({
    splitsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
        backgroundColor: '#fff',
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
        color: '#333',
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
        marginLeft: 16,
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
        color: '#333',
    },
});

export default YourSplits;