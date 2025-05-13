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
                        <Text>Set {index + 1}</Text>
                        <Text>Reps: {set.reps}</Text>
                        <Text>Weight: {set.weight} kg</Text>
                    </View>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({

});