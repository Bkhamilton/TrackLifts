import CreateSplitModal from '@/components/modals/Splits/CreateSplitModal';
import EditSplitModal from '@/components/modals/Splits/EditSplitModal';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookSplits from '@/hooks/useHookSplits';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function SplitScreen() {
    const {
        splits,
        currentWeek,
        showCreateModal,
        newSplitName,
        editingSplit,
        setShowCreateModal,
        setNewSplitName,
        setEditingSplit,
        setAsPrimary,
        createNewSplit,
        updateSplitDay,
    } = useHookSplits();

    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Current Week Display */}
            <Title 
                title="Your Splits" 
                leftContent={
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/(index)')}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#ff8787" />
                    </TouchableOpacity>
                }
            />
            <View style={styles.currentWeekContainer}>
                <Text style={styles.sectionTitle}>CURRENT SPLIT</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {currentWeek.map((day, index) => (
                        <View key={index} style={[
                            styles.dayPill,
                            day.routine === 'Rest' && styles.restDayPill
                        ]}>
                            <Text style={styles.dayText}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
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

            {/* Your Splits Section */}
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
                            item.isPrimary && styles.primarySplitCard
                        ]}>
                            <View style={styles.splitHeader}>
                                <Text style={styles.splitName}>{item.name}</Text>
                                <View style={styles.splitActions}>
                                    {!item.isPrimary && (
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
                            
                            <View style={styles.splitDays}>
                                {item.routines.map((day, index) => (
                                    <View key={index} style={styles.splitDayItem}>
                                        <Text style={styles.dayLabel}>
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.day - 1]}
                                        </Text>
                                        <Text style={styles.routineLabel}>
                                            {day.routine}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Create New Split Modal */}
            <CreateSplitModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={createNewSplit}
                splitName={newSplitName}
                setSplitName={setNewSplitName}
            />

            {/* Edit Split Modal */}
            {editingSplit && (
                <EditSplitModal
                    visible={!!editingSplit}
                    editingSplit={editingSplit}
                    availableRoutines={['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Rest']}
                    onUpdateSplitDay={updateSplitDay}
                    onClose={() => setEditingSplit(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    currentWeekContainer: {
        marginBottom: 24,
        paddingHorizontal: 12,
    },
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