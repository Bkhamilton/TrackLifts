import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Routine {
    routine_id: number;
    routine_title: string;
    usage_count: number;
    last_used: string;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    routines: Routine[];
}

const FavoriteRoutinesModal: React.FC<Props> = ({ visible, onClose, routines }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>All Favorite Routines</Text>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {routines.length > 0 ? (
                            routines.map(routine => (
                                <View key={routine.routine_id} style={styles.routineRow}>
                                    <Text style={styles.routineName}>{routine.routine_title}</Text>
                                    <Text style={styles.usageCount}>Used {routine.usage_count} time{routine.usage_count !== 1 ? 's' : ''}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No favorite routines yet</Text>
                        )}
                    </ScrollView>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    routineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    routineName: {
        fontSize: 16,
        fontWeight: '500',
    },
    usageCount: {
        fontSize: 15,
        color: '#868e96',
    },
    emptyText: {
        color: '#868e96',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 24,
    },
    closeButton: {
        marginTop: 18,
        alignSelf: 'center',
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default FavoriteRoutinesModal;