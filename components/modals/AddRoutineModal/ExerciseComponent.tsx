import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ExerciseComponentProps {
    exercise: Exercise;
    onRemove: (exercise: Exercise) => void;
}

export function ExerciseComponent({ exercise, onRemove }: ExerciseComponentProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{exercise.title}</Text>
            <TouchableOpacity onPress={() => onRemove(exercise)}>
                <View style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between', 
        paddingHorizontal: 6, 
        flexDirection: 'row', 
        width: '100%', 
        alignItems: 'center', 
        borderWidth: 1
    },
    text: {
        fontSize: 16, 
        fontWeight: '500'
    },
    removeButton: {
        padding: 4, 
        borderWidth: 1
    },
    removeButtonText: {
        color: '#ff8787'
    }
});
