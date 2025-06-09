import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import SearchRoutineModal from '@/components/modals/SearchRoutineModal';
import RoutineListSection from '@/components/Routines/RoutineListSection';
import { View } from '@/components/Themed';
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
        searchModalVisible,
        setSearchModalVisible,
        handleSearchSelect
    } = useHookRoutines();

    const router = useRouter();

    return (
        <View style={styles.container}>
            <SearchRoutineModal
                visible={searchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                onSelect={handleSearchSelect}
            />
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
                    <View style={styles.headerRight}>
                        <TouchableOpacity 
                            onPress={() => setSearchModalVisible(true)}
                            style={styles.searchButton}
                        >
                            <MaterialCommunityIcons name="magnify" size={24} color="#ff8787" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRoutineModal(true)}>
                            <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                        </TouchableOpacity>
                    </View>
                }
            />
            
            <View>
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchButton: {
        marginRight: 8,
    },
});