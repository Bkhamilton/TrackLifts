import { Exercise } from '@/constants/types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../Themed';

export default function MusclesTab({ exercise }: { exercise: Exercise }) {
    if (!exercise.muscles || exercise.muscles.length === 0) {
        return <Text>No muscle data available.</Text>;
    }

    return (
        <View style={styles.musclesContainer}>
            <Text style={styles.musclesHeader}>Muscle Activation:</Text>
            {exercise.muscles.map((muscle, index) => (
                <View key={`${muscle.muscle_id}-${index}`} style={styles.muscleRow}>
                    <Text style={styles.muscleName}>{muscle.muscle_name}</Text>
                    <View style={styles.intensityBarContainer}>
                        <View
                            style={[
                                styles.intensityBar,
                                { width: `${muscle.intensity * 100}%` },
                            ]}
                        />
                        <Text style={styles.intensityValue}>
                            {(muscle.intensity * 100).toFixed(0)}%
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    musclesContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
    },
    musclesHeader: {
        fontWeight: '500',
        marginBottom: 8,
    },
    muscleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    muscleName: {
        width: 120,
        fontSize: 14,
    },
    intensityBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    intensityBar: {
        height: '100%',
        backgroundColor: '#ff8787',
        borderRadius: 3,
        marginRight: 8,
    },
    intensityValue: {
        position: 'absolute',
        right: 8,
    },
});
