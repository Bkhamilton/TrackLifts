import CreateSplitModal from '@/components/modals/Splits/CreateSplitModal';
import EditSplitModal from '@/components/modals/Splits/EditSplitModal';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookSplits from '@/hooks/home/useHookSplits';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// New imports
import CurrentSplit from '@/components/Split/CurrentSplit';
import YourSplits from '@/components/Split/YourSplits/YourSplits';
import { RoutineContext } from '@/contexts/RoutineContext';
import { SplitContext } from '@/contexts/SplitContext';

export default function SplitScreen() {
    const {
        dislpaySplits,
        setDisplaySplits,
        currentSplit,
        setCurrentSplit,
        showCreateModal,
        editingSplitId,
        setEditingSplitId,
        setShowCreateModal,
        setAsPrimary,
        createSplit
    } = useHookSplits();

    const { routines } = useContext(RoutineContext);

    const { updateSplitInDB, deleteSplitInDB } = useContext(SplitContext);

    const router = useRouter();

    const editingSplit = editingSplitId !== null
        ? dislpaySplits.find(s => s.id === editingSplitId)
        : null;

    const availableRoutines = [...routines, { id: 1, title: 'Rest', exercises: []}];

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
                currentSplit={currentSplit}
            />

            {/* Your Splits Section */}
            <YourSplits
                splits={dislpaySplits}
                setShowCreateModal={setShowCreateModal}
                setAsPrimary={setAsPrimary}
                setEditingSplit={setEditingSplitId}
                onDeleteSplit={async (splitId: number) => {
                    await deleteSplitInDB(splitId);
                    setDisplaySplits(prev => prev.filter(s => s.id !== splitId));
                    if (currentSplit?.id === splitId) {
                        setCurrentSplit(null); // Clear current split if deleted
                    }
                }}
            />

            {/* Create New Split Modal */}
            <CreateSplitModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={createSplit}
                availableRoutines={availableRoutines}
            />

            {/* Edit Split Modal */}
            {editingSplit && (
                <EditSplitModal
                    visible={!!editingSplit}
                    editingSplit={editingSplit}
                    availableRoutines={availableRoutines}
                    onUpdateSplit={async (updatedSplit) => {
                        // Update displaySplits here (call updateSplitDay, etc. as needed)
                        await updateSplitInDB(updatedSplit);
                        setDisplaySplits(prev =>
                            prev.map(s => s.id === updatedSplit.id ? updatedSplit : s)
                        );
                    }}
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