import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import RoutineCard from '../Home/RoutineCard';

interface RoutinesModalProps {
    visible: boolean;
    onClose: () => void;
    openRoutine: (routine: ActiveRoutine) => void;
    openRoutineOptions: (routine: ActiveRoutine) => void;
    favoriteRoutineIds: number[];
}

export default function RoutinesModal({
    visible,
    onClose,
    openRoutine,
    openRoutineOptions,
    favoriteRoutineIds
}: RoutinesModalProps) {
    const { routines } = React.useContext(DBContext);

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {/* Header with close button */}
                <View style={styles.header}>
                    <Text style={styles.title}>All Routines</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Search bar (optional - you can implement search functionality later) */}
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>Search routines...</Text>
                </View>

                {/* Favorites section */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="star" size={18} color="#ff8787" />
                    <Text style={styles.sectionHeaderText}>Favorites</Text>
                </View>
                <FlatList
                    data={routines.filter(r => favoriteRoutineIds.includes(r.id))}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.routineItem}>
                            <RoutineCard
                                routine={item}
                                open={openRoutine}
                                openRoutineOptions={openRoutineOptions}
                                isFavorite={true}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No favorite routines</Text>
                    }
                />

                {/* All routines section */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="dumbbell" size={18} color="#666" />
                    <Text style={styles.sectionHeaderText}>All Routines</Text>
                </View>
                <FlatList
                    data={routines.filter(r => !favoriteRoutineIds.includes(r.id))}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.routineItem}>
                            <RoutineCard
                                routine={item}
                                open={openRoutine}
                                openRoutineOptions={openRoutineOptions}
                                isFavorite={false}
                            />
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No routines found</Text>
                    }
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchPlaceholder: {
        color: '#999',
        fontSize: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#333',
    },
    routineItem: {
        paddingVertical: 6,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 12,
        fontStyle: 'italic',
    },
});