import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { FlatList, Keyboard, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface NewExerciseModalProps {
    visible: boolean;
    close: () => void;
    onSelect: (exercise: Exercise) => void;
    exercises: Exercise[];
}

// Muscle group icons mapping (consistent with ExerciseList)
const muscleGroupIcons = {
    'Chest': 'weight-lifter',
    'Back': 'human-handsup',
    'Legs': 'human-male-height',
    'Arms': 'arm-flex',
    'Shoulders': 'human-male-height-variant',
    'Core': 'human-queue',
    'Full Body': 'human-greeting-variant',
};

export function NewExerciseModal({ visible, close, onSelect, exercises }: NewExerciseModalProps) {
    const getMuscleGroupIcon = (muscleGroup: string): IconName => {
        return (muscleGroupIcons[muscleGroup as keyof typeof muscleGroupIcons] as IconName) || 'dumbbell';
    };

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
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Add Exercise</Text>
                                <TouchableOpacity onPress={close} style={styles.closeButton}>
                                    <MaterialCommunityIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Exercises List */}
                            <FlatList
                                data={exercises}
                                contentContainerStyle={styles.listContent}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.exerciseItem}
                                        onPress={() => onSelect(item)}
                                    >
                                        <View style={styles.exerciseContent}>
                                            <View style={styles.iconContainer}>
                                                <MaterialCommunityIcons 
                                                    name={getMuscleGroupIcon(item.muscleGroup)} 
                                                    size={24} 
                                                    color="#ff8787" 
                                                />
                                            </View>
                                            <View style={styles.exerciseInfo}>
                                                <Text style={styles.exerciseName}>{item.title}</Text>
                                                <View style={styles.exerciseMeta}>
                                                    <Text style={styles.equipmentText}>{item.equipment}</Text>
                                                    <Text style={styles.muscleGroupText}>{item.muscleGroup}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <MaterialCommunityIcons 
                                            name="plus-circle" 
                                            size={24} 
                                            color="#ff8787" 
                                        />
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPopup: {
        width: '90%',
        maxHeight: '70%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'transparent',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    listContent: {
        paddingBottom: 16,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    exerciseContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    exerciseMeta: {
        flexDirection: 'row',
    },
    equipmentText: {
        fontSize: 13,
        color: '#666',
        marginRight: 8,
    },
    muscleGroupText: {
        fontSize: 13,
        color: '#ff8787',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 68, // icon width + marginRight + paddingHorizontal
    },
});