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
                        { exercise.muscles && exercise.muscles.length > 0 && (
                            <View style={styles.musclesContainer}>
                                <Text style={styles.musclesHeader}>Muscle Intensities:</Text>
                                {exercise.muscles.map((muscle, index) => (
                                    <View key={`${muscle.muscle_id}-${index}`} style={styles.muscleRow}>
                                        <Text style={styles.muscleName}>{muscle.muscle_name}</Text>
                                        <View style={styles.intensityBarContainer}>
                                            <View 
                                                style={[
                                                    styles.intensityBar,
                                                    { width: `${muscle.intensity * 100}%` }
                                                ]}
                                            />
                                            <Text style={styles.intensityValue}>{(muscle.intensity * 100).toFixed(0)}%</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

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
    musclesContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
    },
    musclesHeader: {
        fontWeight: '500',
        marginBottom: 8,
    },
    muscleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    muscleName: {
        width: 120,
        fontSize: 14,
    },
    intensityBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    intensityBar: {
        height: '100%',
        backgroundColor: '#ff8787',
        borderRadius: 3,
        marginRight: 8,
    },
    intensityValue: {
        position: 'absolute',
        right: 8,
    },
});
