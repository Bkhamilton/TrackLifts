import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Exercise } from '@/utils/types';
import { Text, View } from '../Themed';

interface ExerciseModalProps {
    visible: boolean;
    close: () => void;
    exercise: Exercise;
    onDelete: (exercise: Exercise) => void;
}

export default function ExerciseModal({ visible, close, exercise, onDelete }: ExerciseModalProps) {
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalPopup}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress = {close}
                            >
                                <View>
                                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: 275, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '600', fontSize: 15 }}>{exercise.title} ({exercise.equipment})</Text>
                            </View>
                        </View>
                        <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
                        <View style={{ paddingTop: 4 }}>
                            <Text>{exercise.muscleGroup}</Text>
                        </View>
                        {
                            exercise.muscles && (
                                <Text>{JSON.stringify(exercise.muscles)}</Text>
                            )
                        }
                        <View style={{ paddingTop: 16 }}>
                            <TouchableOpacity
                                onPress={() => onDelete(exercise)}
                            >
                                <View style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Delete Exercise</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalPopup:{
        width: '90%',
        
        bottom: '5%',
        elevation: 20,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        marginVertical: 6,
        height: 1,
        width: '100%',
        alignItems: 'center',
    },
    deleteButton: {
        borderRadius: 5,
        paddingVertical: 4,
        backgroundColor: '#ff8787',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        fontSize: 14, 
        fontWeight: '600',
    },
});
