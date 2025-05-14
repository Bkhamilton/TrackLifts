import { Text, View } from '@/components/Themed';
import { ActiveExercise } from '@/utils/types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface ExerciseHeaderProps {
    exercise: ActiveExercise;
}

export default function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
    return (
        <View>
            <Text>{exercise.title} ({exercise.equipment})</Text>
            {
                exercise.sets.map((set, index) => (
                    <View key={index}>
                        <Text>Set {set.set_order}</Text>
                        <Text>{set.reps} x {set.weight}lbs</Text>
                    </View>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({

});