import { ActiveRoutine } from '@/constants/types';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

interface RoutineSelectModalProps {
    visible: boolean;
    onSelect: (routine: ActiveRoutine) => void;
    onClose: () => void;
    title?: string;
    routines: ActiveRoutine[];
}

export default function RoutineSelectModal({
    visible,
    onSelect,
    onClose,
    title = 'Select Routine',
    routines = [],
}: RoutineSelectModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <FlatList
                        data={routines}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={styles.optionText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
    },
});