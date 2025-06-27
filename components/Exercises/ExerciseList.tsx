import { Text, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface ExerciseListProps {
    exercises: Exercise[];
    openModal: (exercise: Exercise) => void;
    sortList: (type: string[]) => void;
    clearSort: () => void;
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Muscle group icons mapping (same as in your modal)
const muscleGroupIcons = {
    'Chest': 'weight-lifter',
    'Back': 'human-handsup',
    'Legs': 'human-male-height',
    'Arms': 'arm-flex',
    'Shoulders': 'human-male-height-variant',
    'Core': 'human-queue',
    'Full Body': 'human-greeting-variant',
};

export default function ExerciseList({ exercises, openModal, sortList, clearSort }: ExerciseListProps) {
    const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);

    const getMuscleGroupIcon = (muscleGroup: string): IconName => {
        return (muscleGroupIcons[muscleGroup as keyof typeof muscleGroupIcons] as IconName) || 'dumbbell';
    };

    const cardBackground = useThemeColor({}, 'grayBackground');

    function toggleCriteria(criteria: string) {
        let updatedCriteria = [...selectedCriteria];
        if (updatedCriteria.includes(criteria)) {
            updatedCriteria = updatedCriteria.filter(c => c !== criteria);
        } else {
            updatedCriteria.push(criteria);
        }

        setSelectedCriteria(updatedCriteria);

        if (updatedCriteria.length > 0) {
            sortList(updatedCriteria);
        } else {
            clearSort();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.sortButtonsContainer}>
                <TouchableOpacity 
                    onPress={() => toggleCriteria("equipment")}
                >
                    <View style={styles.sortButtons}>
                        <Text style={{ fontWeight: selectedCriteria.includes("equipment") ? "600" : "400" }}>
                            Equipment
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => toggleCriteria("muscleGroup")}
                >
                    <View style={styles.sortButtons}>
                        <Text style={{ fontWeight: selectedCriteria.includes("muscleGroup") ? "600" : "400" }}>
                            Muscle Group
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={exercises}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.exerciseItem}
                        onPress={() => openModal(item)}
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
                            name="chevron-right" 
                            size={24} 
                            color="#ccc" 
                        />
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        height: '90%',
    },
    sortButtons: {
        width: 120,
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#ff8787'
    },
    sortButtonsContainer: {
        flexDirection: "row" , 
        marginLeft: 20, 
        justifyContent: 'space-evenly', 
        paddingBottom: 4, 
        paddingTop: 3,
    },
    exerciseListView: {
        flexDirection: 'row', 
        borderWidth: 1, 
        paddingVertical: 4, 
        paddingHorizontal: 6, 
        justifyContent: 'space-between'
    },
    listContent: {
        paddingBottom: 16,
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
        marginLeft: 52, // icon width + marginRight
    },
});
