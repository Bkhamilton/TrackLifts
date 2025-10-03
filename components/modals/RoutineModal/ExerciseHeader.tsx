import { ClearView, Text, View } from '@/components/Themed';
import { ActiveExercise } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface ExerciseHeaderProps {
    exercise: ActiveExercise;
}

export default function ExerciseHeader({ exercise }: ExerciseHeaderProps) {

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <View style={[styles.exerciseContainer, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseSubtitle}>
                    {exercise.muscleGroup} • {exercise.equipment}
                </Text>
            </View>
            
            <ClearView style={styles.setsContainer}>
                {exercise.sets.map((set) => {
                    // Format weight display based on equipment type
                    let weightDisplay = `${set.weight} lbs`;
                    if (exercise.equipment === 'Assisted Bodyweight' && set.weight !== 0) {
                        weightDisplay = `-${Math.abs(set.weight)} lbs`;
                    } else if (exercise.equipment === 'Bodyweight' && set.weight === 0) {
                        weightDisplay = 'Bodyweight';
                    }
                    
                    return (
                        <View key={set.id} style={[styles.setItem, { backgroundColor: cardBorder }]}>
                            <Text style={styles.setNumber}>#{set.set_order}</Text>
                            <Text style={styles.setDetail}>{set.reps} × {weightDisplay}</Text>
                        </View>
                    );
                })}
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    exerciseHeader: {
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    exerciseSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    setsContainer: {
        marginTop: 8,
    },
    setItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        fontSize: 14,
        color: '#666',
    },
    setDetail: {
        fontSize: 14,
        fontWeight: '500',
    },
});