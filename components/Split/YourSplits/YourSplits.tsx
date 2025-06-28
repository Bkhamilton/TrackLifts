import { Text, View } from '@/components/Themed';
import { Splits } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ConfirmationModal from '../../modals/ConfirmationModal';
import SplitCard from './SplitCard';

interface Props {
    splits: Splits[];
    setShowCreateModal: (show: boolean) => void;
    setAsPrimary: (id: number) => void;
    setEditingSplit: (split: number) => void;
    onDeleteSplit: (splitId: number) => void;
}

type ModalProps = {
    visible: boolean;
    splitId: number | null;
}

const YourSplits: React.FC<Props> = ({
    splits,
    setShowCreateModal,
    setAsPrimary,
    setEditingSplit,
    onDeleteSplit,
}) => {
    const [confirmModal, setConfirmModal] = useState<ModalProps>({ visible: false, splitId: null });

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    // Handler for delete confirmation
    const handleDelete = (splitId: number) => {
        setConfirmModal({ visible: true, splitId });
    };

    // Handler for modal selection
    const handleConfirmDelete = (option: 'yes' | 'no') => {
        if (option === 'yes' && confirmModal.splitId !== null) {
            onDeleteSplit(confirmModal.splitId);
        }
        setConfirmModal({ visible: false, splitId: null });
    };

    return (
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
                contentContainerStyle={{ paddingBottom: 85, paddingTop: 12 }}
                renderItem={({ item }) => (
                    <SplitCard
                        item={item}
                        cardBackground={cardBackground}
                        cardBorder={cardBorder}
                        setAsPrimary={setAsPrimary}
                        setEditingSplit={setEditingSplit}
                        handleDelete={handleDelete}
                    />
                )}
            />
            <ConfirmationModal
                visible={confirmModal.visible}
                message="Are you sure you want to delete this split?"
                onClose={() => setConfirmModal({ visible: false, splitId: null })}
                onSelect={handleConfirmDelete}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    splitsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    addButton: {
        padding: 4,
    },
});

export default YourSplits;