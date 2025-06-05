import RoutineCard from '@/components/Home/RoutineCard';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import { Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function RoutinesScreen() {
    const { routines } = useContext(DBContext);

    const { isActiveWorkout, setRoutine } = useContext(ActiveWorkoutContext);

    const [routineOptionsModal, setRoutineOptionsModal] = useState(false);
    const [routineModal, setRoutineModal] = useState(false);

    const router = useRouter();

    const [routine, setSelectRoutine] = useState<ActiveRoutine>({
        id: 0,
        title: 'Test Routine',
        exercises: []
    });

    const favoriteRoutineIds = [2, 4]; // Example favorite routine IDs, replace with actual logic to fetch favorites

    const openRoutine = (routine: ActiveRoutine) => {
        setSelectRoutine(routine);
        setRoutineModal(true);
    }
    const openRoutineOptions = (routine: ActiveRoutine) => {
        setSelectRoutine(routine);
        setRoutineOptionsModal(true);
    }

    const onStart = (routine: ActiveRoutine) => {
        setRoutine(routine);
        setRoutineModal(false);
        if (isActiveWorkout) {
            alert('You already have an active workout. Please finish it before starting a new one.');
            setTimeout(() => {
                router.replace('/(tabs)/workout/activeWorkout');
            }, 500);
        } else {
            router.replace('/(tabs)/workout/newWorkout');
        }
        
    }

    return (
        <View style={styles.container}>
            <RoutineOptions
                visible={routineOptionsModal}
                close={() => setRoutineOptionsModal(false)}
                routine={routine}
            />
            <RoutineModal
                visible={routineModal}
                close={() => setRoutineModal(false)}
                start={() => onStart(routine)}
                routine={routine}
            />
            {/* Header with close button */}
            <Title
                title="Your Routines"
                leftContent={
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/(index)')}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#ff8787" />
                    </TouchableOpacity>
                }
                rightContent={
                    <TouchableOpacity onPress={() => setRoutineModal(true)}>
                        <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                    </TouchableOpacity>
                }
            />
            
            <View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
        backgroundColor: 'transparent'
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
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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