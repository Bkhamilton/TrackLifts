import { Text, TextInput, View } from '@/components/Themed';
import { ActiveSet } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, PanResponder, StyleSheet, TouchableOpacity } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    editingSet: number | null;
    setEditingSet: React.Dispatch<React.SetStateAction<number | null>>;
    onToggleComplete: (setId: number) => void;
    isCompleted: boolean;
    onDeleteSet: (setId: number) => void;
}

export default function SetCard({ 
    set, 
    onUpdateSet, 
    editingSet, 
    setEditingSet,
    onToggleComplete,
    isCompleted,
    onDeleteSet
}: SetCardProps) {
    const pan = React.useRef(new Animated.ValueXY()).current;
    const SWIPE_THRESHOLD = -60;

    const panResponder = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dx < SWIPE_THRESHOLD) {
                    Animated.timing(pan, {
                        toValue: { x: -200, y: 0 },
                        duration: 200,
                        useNativeDriver: false
                    }).start(() => onDeleteSet(set.id));
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Animated.View 
            style={[
                styles.setContainer,
                isCompleted && styles.completedSet,
                { transform: [{ translateX: pan.x }] }
            ]}
            {...panResponder.panHandlers}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.setNumber}>#{set.set_order}</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={set.weight.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'weight', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>kg</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, isCompleted && styles.completedInput]}
                        value={set.reps.toString()}
                        onChangeText={(value) => onUpdateSet(set.id, 'reps', value)}
                        keyboardType="numeric"
                        onFocus={() => setEditingSet(set.id)}
                        onBlur={() => setEditingSet(null)}
                        editable={!isCompleted}
                    />
                    <Text style={styles.unit}>reps</Text>
                </View>

                <TouchableOpacity 
                    onPress={() => onToggleComplete(set.id)}
                    style={styles.checkContainer}
                >
                    <MaterialCommunityIcons
                        name={isCompleted ? "check-circle" : (editingSet === set.id ? "pencil" : "circle-outline")}
                        size={24}
                        color={isCompleted ? "green" : (editingSet === set.id ? "#007AFF" : "#aaa")}
                    />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => onDeleteSet(set.id)}
            >
                <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: 'transparent',
    },
    setNumber: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 6,
        width: 60,
        textAlign: 'center',
        marginRight: 4,
        backgroundColor: 'white',
    },
    unit: {
        fontSize: 12,
        color: '#777',
    },
    completedSet: {
        backgroundColor: '#f0fff0',
    },
    completedInput: {
        backgroundColor: '#e0ffe0',
        color: '#555',
    },
    checkContainer: {
        width: 24,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        position: 'absolute',
        right: -80,
    },
});