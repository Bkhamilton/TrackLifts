import { Text } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface RoutineCardProps {
    routine: ActiveRoutine;
    open: (routine: ActiveRoutine) => void;
    openRoutineOptions: (routine: ActiveRoutine) => void;
    isFavorite?: boolean;
}

export default function RoutineCard({ routine, open, openRoutineOptions, isFavorite = false }: RoutineCardProps) {
    // Calculate total sets
    const totalSets = routine.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    
    // Get unique muscle groups
    const muscleGroups = [...new Set(routine.exercises.map(ex => ex.muscleGroup))];
    const primaryMuscleGroup = muscleGroups.length > 0 ? muscleGroups[0] : null;
    const additionalMuscles = muscleGroups.length - 1;

    return (
        <View style={[styles.container, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
            <TouchableOpacity 
                style={styles.touchable}
                onPress={() => open(routine)}
            >
                <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{routine.title}</Text>
                            {isFavorite && (
                                <MaterialCommunityIcons 
                                    name="star" 
                                    size={16} 
                                    color="#ff8787" 
                                    style={styles.favoriteIcon}
                                />
                            )}
                        </View>
                        
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailText}>
                                    {routine.exercises.length} {routine.exercises.length === 1 ? 'exercise' : 'exercises'}
                                </Text>
                            </View>
                            
                            <View style={styles.detailItem}>
                                <Text style={styles.detailText}>
                                    {totalSets} {totalSets === 1 ? 'set' : 'sets'}
                                </Text>
                            </View>
                            
                            {primaryMuscleGroup && (
                                <View style={styles.detailItem}>
                                    <Text style={styles.muscleGroupText}>
                                        {primaryMuscleGroup}
                                        {additionalMuscles > 0 && ` +${additionalMuscles}`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => openRoutineOptions(routine)}
                        style={styles.optionsButton}
                    >
                        <SimpleLineIcons name="options" size={20} color="#ff8787" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    touchable: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    detailItem: {
        marginRight: 12,
        marginBottom: 2,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    muscleGroupText: {
        fontSize: 13,
        color: '#ff8787',
        fontWeight: '500',
    },
    optionsButton: {
        padding: 8,
        marginLeft: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteIcon: {
        marginLeft: 6,
    },
});