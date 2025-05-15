import { Text, View } from '@/components/Themed';
import { ActiveExercise, ActiveSet } from '@/utils/types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface WorkoutInfoProps {
    exercise: ActiveExercise;
}

export default function WorkoutInfo({ exercise }: WorkoutInfoProps) {
    function SetCard({ set } : { set: ActiveSet }) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>#{set.set_order}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{set.weight} kg</Text>
                    <Text style={{ marginLeft: 10 }}>{set.reps} reps</Text>
                </View>
            </View>
        );
    }

    function addSet() {
        exercise.sets.push({
            id: exercise.sets.length + 1,
            set_order: exercise.sets.length + 1,
            weight: 100,
            reps: 10,
            restTime: 60,
        });
        exercise.sets.sort((a, b) => a.set_order - b.set_order);
    }

    return (
        <View>
            <View>
                <Text style={{ fontSize: 17 }}>{exercise.title}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 14 }}>Sets</Text>
            </View>
            {
                exercise.sets.map((type) => (
                    <View style={{ paddingVertical: 2 }} key={type.set_order}>
                        <SetCard set={type} />
                    </View>
                ))
            }
            <TouchableOpacity onPress={addSet}>
                <View style={styles.addSetButton}>
                    <Text>Add Set</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    addSetButton: {
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#ff8787',
    },
});
