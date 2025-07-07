import { ClearView, Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type MuscleGroup = {
    id: string;
    name: string;
    value: number;
    description: string;
    exercises: string[];
};

const MuscleLabels = ({
    muscleData,
    selectedMuscle,
    setSelectedMuscle,
    getColor,
    view, // <-- add view prop
}: {
    muscleData: MuscleGroup[];
    selectedMuscle: string | null;
    setSelectedMuscle: (id: string | null) => void;
    getColor: (intensity: number) => string;
    view: 'front' | 'back'; // <-- add view type
}) => {
    // Filter muscles based on view
    const filteredMuscleData = muscleData.filter(muscle => {
        if (view === 'front') {
            return muscle.id !== 'back';
        } else {
            return muscle.id !== 'chest' && muscle.id !== 'core';
        }
    });

    return (
        <ClearView style={styles.labelsContainer}>
            {filteredMuscleData.map((muscle) => {
                const isSelected = selectedMuscle === muscle.id;
                return (
                    <TouchableOpacity
                        key={muscle.id}
                        style={[
                            styles.labelItem,
                            isSelected && styles.selectedLabelItem
                        ]}
                        onPress={() => setSelectedMuscle(isSelected ? null : muscle.id)}
                    >
                        <View
                            style={[
                                styles.colorBox,
                                { backgroundColor: getColor(muscle.value) }
                            ]}
                        />
                        <Text style={[
                            styles.labelText,
                            isSelected && styles.selectedLabelText
                        ]}>
                            {muscle.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ClearView>
    );
};

const styles = StyleSheet.create({
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    selectedLabelItem: {
        backgroundColor: '#e3f2fd',
        borderColor: '#4a86e8',
        borderWidth: 2,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    labelText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#444',
    },
    selectedLabelText: {
        color: '#1976d2',
    },
});

export default MuscleLabels;
