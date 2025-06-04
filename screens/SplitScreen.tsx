import CreateSplitModal from '@/components/modals/Splits/CreateSplitModal';
import EditSplitModal from '@/components/modals/Splits/EditSplitModal';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import useHookSplits from '@/hooks/useHookSplits';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// New imports
import CurrentSplit from '@/components/Split/CurrentSplit';
import YourSplits from '@/components/Split/YourSplits';

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
        addDayToSplit,
        removeDayFromSplit,
    } = useHookSplits();

    const router = useRouter();

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
            <CurrentSplit currentWeek={currentWeek} />

            {/* Your Splits Section */}
            <YourSplits
                splits={splits}
                setShowCreateModal={setShowCreateModal}
                setAsPrimary={setAsPrimary}
                setEditingSplit={setEditingSplit}
            />

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
                    onAddDay={addDayToSplit}
                    onRemoveDay={removeDayFromSplit}
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
});