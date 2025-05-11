import { Text, View } from '@/components/Themed';
import { Exercise, Set } from '@/utils/types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface WorkoutInfoProps {
    exercise: Exercise;
    sets: Set[];
}

export default function WorkoutInfo({ exercise, sets }: WorkoutInfoProps) {
    function SetCard({ set } : { set: Set }) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>#{set.number}</Text>
            </View>
        );
    }

    function addSet() {
        sets.push({
            number: sets.length + 1,
            weight: 100,
            reps: 10,
        });
        console.log(sets.length);
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
                sets.map((type) => (
                    <View style={{ paddingVertical: 2 }} key={type.number}>
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
