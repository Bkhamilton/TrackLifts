import * as React from 'react';
import { FlatList, Keyboard, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';

interface NewExerciseModalProps {
    visible: boolean;
    close: () => void;
    onSelect: (exercise: Exercise) => void;
    exercises: Exercise[];
}

export function NewExerciseModal({ visible, close, onSelect, exercises }: NewExerciseModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalPopup}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 4 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>Add Exercise</Text>
                            </View>
                            <FlatList
                                data={exercises}
                                renderItem={({ item }) => (
                                    <View style={{ paddingVertical: 4 }}>
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => onSelect(item)}
                                        >
                                            <View style={{ flexDirection: 'row', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 12 }}>{item.title} ({item.title})</Text>
                                                <View>
                                                    <Text style={{ fontWeight: '500', fontSize: 15 }}>{item.muscleGroup}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalPopup: {
        width: '90%',
        height: '40%',
        bottom: '5%',
        elevation: 20,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white', // Ensure the modal content has a background color
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});