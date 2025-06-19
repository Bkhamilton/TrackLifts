import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
import OptionsModal from '@/components/modals/OptionsModal';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import SearchRoutineModal from '@/components/modals/SearchRoutineModal';
import RoutineListSection from '@/components/Routines/RoutineListSection';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import { RoutineContext } from '@/contexts/RoutineContext';
import useHookRoutines from '@/hooks/useHookRoutines';
import useRoutineOptionsHandler from '@/hooks/useRoutineOptionsHandler';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function RoutinesScreen() {
    const [favoritesRefreshKey, setFavoritesRefreshKey] = useState(0);
    const refreshFavorites = () => setFavoritesRefreshKey(k => k + 1);

    const {
        routines,
        favoriteRoutineIds,
        routine,
        routineModal,
        routineOptionsModal,
        addRoutineModal,
        setRoutineModal,
        setRoutineOptionsModal,
        setAddRoutineModal,
        openRoutine,
        openRoutineOptions,
        onStart,
        searchModalVisible,
        setSearchModalVisible,
        handleSearchSelect
    } = useHookRoutines({ favoritesRefreshKey });

    const router = useRouter();

    const { addRoutineToDB } = useContext(RoutineContext);

    const onAdd = (routine: { title: string; exercises: Exercise[] }) => {
        const newRoutine = {
            ...routine,
            id: 0, // ID will be auto-incremented by the database
        };
        addRoutineToDB(newRoutine)
            .then((id) => {
                if (id) {
                    console.log('Routine added with ID:', id);
                } else {
                    console.log('Failed to add routine');
                }
            })
            .catch((error) => {
                console.error('Error adding routine:', error);
            });
        setAddRoutineModal(false);
    }

    const handleOption = useRoutineOptionsHandler({
        routine,
        onStart,
        closeOptionsModal: () => setRoutineOptionsModal(false),
        refreshFavorites,
    });

    return (
        <View style={styles.container}>
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
                        <TouchableOpacity onPress={() => setAddRoutineModal(true)}>
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
                    listHeight={2 * 90 + 8}
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
                    listHeight={4 * 90 + 3 * 8}
                />
            </View>
            <SearchRoutineModal
                visible={searchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                onSelect={handleSearchSelect}
            />
            <OptionsModal
                visible={routineOptionsModal}
                close={() => setRoutineOptionsModal(false)}
                title={routine.title}
                options={[
                    { label: 'Start Workout', value: 'start' },
                    { label: 'Edit Routine', value: 'edit' },
                    { label: 'Favorite Routine', value: 'favorite' },
                    { label: 'Delete Routine', value: 'delete', destructive: true }
                ]}
                onSelect={handleOption}
            />
            <RoutineModal
                visible={routineModal}
                close={() => setRoutineModal(false)}
                start={() => onStart(routine)}
                routine={routine}
                onFavoriteChange={refreshFavorites}
            />
            <AddRoutineModal
                visible={addRoutineModal}
                close={() => setAddRoutineModal(false)}
                add={onAdd}
            />
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