import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

export default function FinishWorkoutScreen() {
    const router = useRouter();

    const { routine } = useContext(ActiveWorkoutContext);
    const totalTime = '00:00:00'; // Placeholder, replace with actual time calculation logic
    const totalWorkoutsCompleted = routine.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0;

    // Calculate workout statistics
    const totalSets = routine.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0;
    const totalWeightMoved = routine.exercises?.reduce((sum, ex) => {
        return sum + ex.sets.reduce((exerciseSum, set) => exerciseSum + (set.weight * set.reps), 0);
    }, 0) || 0;
    
    const highestWeight = Math.max(...(routine.exercises?.flatMap(ex => 
        ex.sets.map(set => set.weight)
    ) || [0]));
    
    const exerciseStats = routine.exercises?.map(exercise => ({
        title: exercise.title,
        sets: exercise.sets.length,
        totalWeight: exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0),
        highestWeight: Math.max(...exercise.sets.map(set => set.weight))
    })) || [];

    // Animation state
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.elastic(1),
                useNativeDriver: true
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    const handleDone = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Celebration animation */}
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

                {/* Summary stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statRow}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#666" />
                        <Text style={styles.statText}>Time: {totalTime}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <MaterialCommunityIcons name="weight-lifter" size={24} color="#666" />
                        <Text style={styles.statText}>Total Sets: {totalSets}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <MaterialCommunityIcons name="weight-kilogram" size={24} color="#666" />
                        <Text style={styles.statText}>Total Weight Moved: {totalWeightMoved} kg</Text>
                    </View>
                    <View style={styles.statRow}>
                        <MaterialCommunityIcons name="trophy" size={24} color="#666" />
                        <Text style={styles.statText}>Highest Weight: {highestWeight} kg</Text>
                    </View>
                </View>

                {/* Exercise breakdown */}
                <View style={styles.exercisesContainer}>
                    <Text style={styles.sectionTitle}>Exercise Breakdown</Text>
                    {exerciseStats.map((exercise, index) => (
                        <View key={index} style={styles.exerciseItem}>
                            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                            <View style={styles.exerciseStats}>
                                <Text style={styles.exerciseStat}>Sets: {exercise.sets}</Text>
                                <Text style={styles.exerciseStat}>Volume: {exercise.totalWeight} kg</Text>
                                <Text style={styles.exerciseStat}>Max: {exercise.highestWeight} kg</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Done button */}
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Awesome! Let's Celebrate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space for the button
    },
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
    statsContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    statText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    exercisesContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
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
        color: '#333',
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
    doneButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});