import { ExerciseContext } from '@/contexts/ExerciseContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface AddToWorkoutModalProps {
    visible: boolean;
    close: () => void;
    add: (props: Exercise) => void;
}

// Muscle group icons mapping
const muscleGroupIcons = {
    'Chest': 'weight-lifter',
    'Back': 'human-handsup',
    'Legs': 'human-male-height',
    'Arms': 'arm-flex',
    'Shoulders': 'human-male-height-variant',
    'Core': 'human-queue',
    'Full Body': 'human-greeting-variant',
    // Add more muscle groups as needed
};

export default function AddToWorkoutModal({ visible, close, add }: AddToWorkoutModalProps) {
    const { exercises } = useContext(ExerciseContext);

    const getMuscleGroupIcon = (muscleGroup: string): IconName => {
        return (muscleGroupIcons[muscleGroup as keyof typeof muscleGroupIcons] as IconName) || 'dumbbell';
    };

    const cardBackground = useThemeColor({}, 'grayBackground');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={close}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
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
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.exerciseItem}
                                onPress={() => add(item)}
                            >
                                <View style={styles.exerciseContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: cardBackground }]}>
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
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '70%',
        borderRadius: 12,
        padding: 16,
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
        marginBottom: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    listContent: {
        paddingBottom: 8,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
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
    },
});