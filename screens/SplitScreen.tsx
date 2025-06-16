import CreateSplitModal from '@/components/modals/Splits/CreateSplitModal';
import EditSplitModal from '@/components/modals/Splits/EditSplitModal';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookSplits from '@/hooks/useHookSplits';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// New imports
import CurrentSplit from '@/components/Split/CurrentSplit';
import YourSplits from '@/components/Split/YourSplits';
import { RoutineContext } from '@/contexts/RoutineContext';

export default function SplitScreen() {
    const {
        dislpaySplits,
        currentWeek,
        currentSplit,
        showCreateModal,
        newSplitName,
        editingSplitId,
        setEditingSplitId,
        setShowCreateModal,
        setNewSplitName,
        setEditingSplit,
        setAsPrimary,
        createNewSplit,
        updateSplitDay,
        addDayToSplit,
        removeDayFromSplit,
        createSplit
    } = useHookSplits();

    const { routines } = useContext(RoutineContext);

    const router = useRouter();

    const editingSplit = editingSplitId !== null
        ? dislpaySplits.find(s => s.id === editingSplitId)
        : null;

    return (
        <View style={styles.container}>
            <Title 
                title="Your Splits" 
                leftContent={
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/(index)')}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#ff8787" />
                    </TouchableOpacity>
                }
            />

            {/* Current Week Display */}
            <CurrentSplit 
                currentWeek={currentWeek} 
                splitName={currentSplit?.name || 'No active split'} 
            />

            {/* Your Splits Section */}
            <YourSplits
                splits={dislpaySplits}
                setShowCreateModal={setShowCreateModal}
                setAsPrimary={setAsPrimary}
                setEditingSplit={setEditingSplitId}
            />

            {/* Create New Split Modal */}
            <CreateSplitModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={createSplit}
                availableRoutines={routines.map(r => r.title)}
            />

            {/* Edit Split Modal */}
            {editingSplit && (
                <EditSplitModal
                    visible={!!editingSplit}
                    editingSplit={editingSplit}
                    availableRoutines={routines.map(r => r.title)}
                    onUpdateSplitDay={updateSplitDay}
                    onAddDay={addDayToSplit}
                    onRemoveDay={removeDayFromSplit}
                    onClose={() => setEditingSplitId(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});