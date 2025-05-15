import { Muscle } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MuscleSelectionModalProps {
    visible: boolean;
    groupedMuscles: Record<string, Muscle[]>;
    selectedMuscles: { muscleId: number }[];
    onSelectMuscle: (muscle: Muscle) => void;
    onClose: () => void;
}

export function MuscleSelectionModal({
    visible,
    groupedMuscles,
    selectedMuscles,
    onSelectMuscle,
    onClose,
}: MuscleSelectionModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={onClose}
        >
            <View style={styles.muscleModalBackdrop}>
                <View style={styles.muscleModalContainer}>
                    <View style={styles.muscleModalPopup}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={onClose}>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 15 }}>Select Muscles</Text>
                            <View></View>
                        </View>
                        <FlatList
                            data={Object.keys(groupedMuscles)}
                            renderItem={({ item: groupName }) => (
                                <View style={styles.muscleGroupContainer}>
                                    <Text style={styles.muscleGroupHeader}>{groupName}</Text>
                                    <View style={styles.muscleList}>
                                        {groupedMuscles[groupName].map(muscle => (
                                            <TouchableOpacity
                                                key={muscle.id}
                                                onPress={() => onSelectMuscle(muscle)}
                                                disabled={selectedMuscles.some(m => m.muscleId === muscle.id)}
                                                style={[
                                                    styles.muscleItem,
                                                    selectedMuscles.some(m => m.muscleId === muscle.id) && styles.selectedMuscle
                                                ]}
                                            >
                                                <Text style={styles.muscleItemText}>{muscle.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
                            keyExtractor={groupName => groupName}
                            contentContainerStyle={styles.muscleListContent}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    muscleModalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    muscleModalContainer: {
        width: '90%',
        maxHeight: '80%',
    },
    muscleModalPopup: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    muscleModalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    muscleGroupContainer: {
        marginBottom: 15,
    },
    muscleGroupHeader: {
        fontWeight: '600',
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        paddingLeft: 8,
    },
    muscleList: {
        marginLeft: 8,
    },
    muscleItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 8,
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
    },
    selectedMuscle: {
        backgroundColor: '#e0e0e0',
        borderColor: '#aaa',
    },
    muscleItemText: {
        color: '#333',
    },
    muscleListContent: {
        paddingBottom: 10,
    },
});
