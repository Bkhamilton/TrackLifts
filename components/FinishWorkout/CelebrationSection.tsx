import { Text, View } from '@/components/Themed';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
    totalWorkoutsCompleted: number;
};

export default function CelebrationSection({ totalWorkoutsCompleted }: Props) {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        // Cleanup function to reset animation when component unmounts
        const animation = animationRef.current;
        return () => {
            if (animation) {
                animation.reset();
            }
        };
    }, []);

    const handleAnimationFinish = () => {
        // Reset animation to prevent crash after completion
        if (animationRef.current) {
            animationRef.current.reset();
        }
    };

    return (
        <View style={styles.celebrationContainer}>
            <LottieView
                ref={animationRef}
                source={require('@/assets/animations/confetti.json')}
                autoPlay
                loop={false}
                style={styles.celebrationAnimation}
                onAnimationFinish={handleAnimationFinish}
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
