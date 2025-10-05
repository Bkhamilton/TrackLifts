import { Text, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ExerciseComponentProps {
    exercise: Exercise;
    onRemove: (exercise: Exercise) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export function ExerciseComponent({ 
    exercise, 
    onRemove, 
    onMoveUp, 
    onMoveDown, 
    isFirst = false, 
    isLast = false 
}: ExerciseComponentProps) {
    return (
        <View style={styles.container}>
            {/* Reorder buttons on the left */}
            {(onMoveUp || onMoveDown) && (
                <View style={styles.reorderButtons}>
                    <TouchableOpacity 
                        onPress={onMoveUp}
                        style={[styles.arrowButton, isFirst && styles.arrowButtonDisabled]}
                        disabled={isFirst}
                    >
                        <MaterialCommunityIcons 
                            name="chevron-up" 
                            size={20} 
                            color={isFirst ? "#ccc" : "#666"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={onMoveDown}
                        style={[styles.arrowButton, isLast && styles.arrowButtonDisabled]}
                        disabled={isLast}
                    >
                        <MaterialCommunityIcons 
                            name="chevron-down" 
                            size={20} 
                            color={isLast ? "#ccc" : "#666"} 
                        />
                    </TouchableOpacity>
                </View>
            )}
            
            <View style={styles.content}>
                <MaterialCommunityIcons 
                    name={"dumbbell"} 
                    size={20} 
                    color="#ff8787" 
                    style={styles.icon}
                />
                <Text style={styles.text}>{exercise.title}</Text>
            </View>
            <TouchableOpacity 
                onPress={() => onRemove(exercise)}
                style={styles.removeButton}
            >
                <MaterialCommunityIcons 
                    name="close" 
                    size={18} 
                    color="#ff8787" 
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
    },
    draggingContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    reorderButtons: {
        flexDirection: 'column',
        marginRight: 8,
        backgroundColor: 'transparent',
    },
    arrowButton: {
        padding: 2,
        backgroundColor: 'transparent',
    },
    arrowButtonDisabled: {
        opacity: 0.3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    icon: {
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
    removeButton: {
        padding: 6,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
});