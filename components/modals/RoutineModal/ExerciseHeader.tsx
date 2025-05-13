import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';
import * as React from 'react';

interface ExerciseHeaderProps {
    exercise: Exercise;
}

export default function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
    return (
        <View>
            <Text>{exercise.title} ({exercise.equipment})</Text>
        </View>
    );
}
