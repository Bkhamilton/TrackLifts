import { Exercise } from '@/utils/types';
import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
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
    const startIndex = useSharedValue(index);

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isActive.value = true;
            startY.value = position.value.y;
            startIndex.value = index;
            runOnJS(onLongPress)();
        })
        .onUpdate((event) => {
            translateY.value = startY.value + event.translationY;
            
            // Calculate new position index
            const newIndex = Math.round(translateY.value / ITEM_HEIGHT);
            const clampedIndex = Math.min(
                Math.max(newIndex, 0),
                positions.value.length - 1
            );

            // Update positions
            if (clampedIndex !== startIndex.value) {
                const newPositions = [...positions.value];
                
                // Move items up or down
                const direction = clampedIndex > startIndex.value ? 1 : -1;
                for (let i = startIndex.value; i !== clampedIndex; i += direction) {
                    newPositions[i].y = newPositions[i + direction].y;
                    newPositions[i].originalIndex = newPositions[i + direction].originalIndex;
                }
                
                newPositions[clampedIndex] = {
                    y: clampedIndex * ITEM_HEIGHT,
                    originalIndex: index
                };
                
                positions.value = newPositions;
                startIndex.value = clampedIndex;
            }
        })
        .onEnd(() => {
            // Snap to final position
            translateY.value = withTiming(startIndex.value * ITEM_HEIGHT, { duration: 200 });
            isActive.value = false;
            runOnJS(onDragEnd)();
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'relative', // Add this
            top: 0, // Add this
            transform: [
                { translateY: translateY.value },
                { scale: isActive.value ? 1.03 : 1 }
            ],
            zIndex: isActive.value ? 100 : 0,
            height: ITEM_HEIGHT,
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <GestureDetector gesture={Gesture.Simultaneous(
                Gesture.LongPress().minDuration(300),
                panGesture
            )}>
                <View style={{ height: ITEM_HEIGHT }}>
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