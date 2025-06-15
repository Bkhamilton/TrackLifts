import { Text, View } from '@/components/Themed';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
    totalWorkoutsCompleted: number;
};

export default function CelebrationSection({ totalWorkoutsCompleted }: Props) {
    return (
        <View style={styles.celebrationContainer}>
            <LottieView
                source={require('@/assets/animations/confetti.json')}
                autoPlay
                loop={false}
                style={styles.celebrationAnimation}
            />
            <Text style={styles.successText}>🎉 Workout Completed! 🎉</Text>
            <Text style={styles.workoutCount}>{totalWorkoutsCompleted} Workouts Completed</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    celebrationContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    celebrationAnimation: {
        width: 200,
        height: 150,
        position: 'absolute',
        top: -50,
    },
    successText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
        textAlign: 'center',
    },
    workoutCount: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
});
