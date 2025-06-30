import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

type ExerciseStat = {
    title: string;
    sets: number;
    totalWeight: number;
    highestWeight: number;
};

type Props = {
    exerciseStats: ExerciseStat[];
};

export default function ExerciseBreakdownSection({ exerciseStats }: Props) {
    return (
        <View style={styles.exercisesContainer}>
            <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
            {exerciseStats.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                    <View style={styles.exerciseStats}>
                        <Text style={styles.exerciseStat}>Sets: {exercise.sets}</Text>
                        <Text style={styles.exerciseStat}>Volume: {exercise.totalWeight} lbs</Text>
                        <Text style={styles.exerciseStat}>Max: {exercise.highestWeight} lbs</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    exercisesContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    exerciseItem: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    exerciseStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseStat: {
        fontSize: 14,
        color: '#666',
    },
});
