import { ClearView, Text, View } from '@/components/Themed';
import { ActiveExercise } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';

interface ExerciseCardProps {
    exercise: ActiveExercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
    const cardBorder = useThemeColor({}, 'grayBorder');
    const cardBackground = useThemeColor({}, 'grayBackground');

    return (
        <View style={[styles.exerciseContainer, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
            <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseSubtitle}>
                    {exercise.muscleGroup} • {exercise.equipment}
                </Text>
            </View>
            
            <ClearView style={styles.setsContainer}>
                {exercise.sets.map((set, index) => {
                    // Format weight display based on equipment type
                    let weightDisplay = `${set.weight} lbs`;
                    if (exercise.equipment === 'Assisted Bodyweight' && set.weight !== 0) {
                        weightDisplay = `-${Math.abs(set.weight)} lbs`;
                    } else if (exercise.equipment === 'Bodyweight' && set.weight === 0) {
                        weightDisplay = 'Bodyweight';
                    }
                    
                    return (
                        <View key={index} style={[styles.setItem, { backgroundColor: cardBorder}]}>
                            <Text style={styles.setNumber}>Set {set.set_order}</Text>
                            <Text style={styles.setDetail}>{set.reps} reps × {weightDisplay}</Text>
                            {set.restTime > 0 && (
                                <Text style={styles.restTime}>Rest: {set.restTime}s</Text>
                            )}
                        </View>
                    );
                })}
            </ClearView>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseContainer: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    exerciseHeader: {
        marginBottom: 8,
        backgroundColor: 'transparent',
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
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    setNumber: {
        fontSize: 14,
        color: '#666',
    },
    setDetail: {
        fontSize: 14,
        fontWeight: '500',
    },
    restTime: {
        fontSize: 13,
        color: '#ff8787',
    },
});