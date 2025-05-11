import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Set, workoutSet } from '../types';
import { Text, View } from './Themed';

export default function WorkoutInfo(props: workoutSet) {
    function SetHeader(props: { set: Set }) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>#{props.set.number}</Text>
            </View>
        );
    }

    const sets = props.sets;
    const setInfo = sets.map((type) => (
        <View key={type.number}>
            <SetHeader set={type} />
        </View>
    ));

    function addSet() {
        sets.push({
            number: sets.length + 1,
            weight: 100,
            reps: 10,
        });
        console.log(sets.length);
    }

    return (
        <View style={{ borderWidth: 1 }}>
            <View>
                <Text style={{ fontSize: 17 }}>{props.exercise.title}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 14 }}>Sets</Text>
            </View>
            {setInfo}
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
