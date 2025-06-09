import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import RoutineListSection from '@/components/Routines/RoutineListSection';
import { Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookRoutines from '@/hooks/useHookRoutines';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function RoutinesScreen() {
    const {
        routines,
        favoriteRoutineIds,
        routine,
        routineModal,
        routineOptionsModal,
        setRoutineModal,
        setRoutineOptionsModal,
        openRoutine,
        openRoutineOptions,
        onStart,
    } = useHookRoutines();

    const router = useRouter();

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
                
                <RoutineListSection
                    title="Favorites"
                    icon="star"
                    iconColor="#ff8787"
                    routines={routines.filter(r => favoriteRoutineIds.includes(r.id))}
                    isFavorite={true}
                    openRoutine={openRoutine}
                    openRoutineOptions={openRoutineOptions}
                    emptyText="No favorite routines"
                />

                <RoutineListSection
                    title="All Routines"
                    icon="dumbbell"
                    iconColor="#666"
                    routines={routines.filter(r => !favoriteRoutineIds.includes(r.id))}
                    isFavorite={false}
                    openRoutine={openRoutine}
                    openRoutineOptions={openRoutineOptions}
                    emptyText="No routines found"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});