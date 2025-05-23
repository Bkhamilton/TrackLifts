import { Exercise } from '@/utils/types';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { View } from '../../Themed';
import { ExerciseComponent } from './ExerciseComponent';

type Position = {
    y: number;
    originalIndex: number;
};

export const DraggableExercise = ({
    exercise,
    index,
    positions,
    isDragging,
    onLongPress,
    onDragEnd,
    onRemove,
}: {
    exercise: Exercise;
    index: number;
    positions: SharedValue<Position[]>;
    isDragging: boolean;
    onLongPress: () => void;
    onDragEnd: () => void;
    onRemove: (exercise: Exercise) => void;
}) => {
    const ITEM_HEIGHT = 60; // Fixed height for each item
    const position = useDerivedValue(() => {
        return positions.value[index] || { y: index * ITEM_HEIGHT, originalIndex: index };
    });
    const isActive = useSharedValue(false);
    const translateY = useSharedValue(position.value.y);
    const startY = useSharedValue(position.value.y);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isActive.value = true;
            startY.value = position.value.y;
        })
        .onUpdate((event) => {
            translateY.value = startY.value + event.translationY;

            // Update positions
            const newPositions = [...positions.value];
            newPositions[index] = { y: translateY.value, originalIndex: index };

            // Check for swaps
            for (let i = 0; i < newPositions.length; i++) {
                if (i !== index && Math.abs(translateY.value - newPositions[i].y) < ITEM_HEIGHT / 2) {
                    // Swap positions
                    const tempY = newPositions[i].y;
                    newPositions[i].y = position.value.y;
                    position.value.y = tempY;
                    break;
                }
            }

            positions.value = newPositions;
        })
        .onEnd(() => {
            isActive.value = false;
            translateY.value = withSpring(position.value.y);
            runOnJS(onDragEnd)();
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: isActive.value ? 1.03 : 1 }
            ],
            zIndex: isActive.value ? 1 : 0,
            height: ITEM_HEIGHT - 8, // Account for margin
            marginBottom: 8,
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <GestureDetector gesture={Gesture.Simultaneous(
                Gesture.LongPress().minDuration(300).onStart(() => runOnJS(onLongPress)()),
                panGesture
            )}>
                <View collapsable={false}>
                    <ExerciseComponent
                        exercise={exercise}
                        onRemove={onRemove}
                        isDragging={isDragging}
                    />
                </View>
            </GestureDetector>
        </Animated.View>
    );
};
