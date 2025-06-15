import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export default function useHookFinishWorkout() {
    const { routine, finalTime } = useContext(ActiveWorkoutContext);
    const { addRoutineToDB } = useContext(DBContext);
    const { finalWorkout, saveWorkoutToDatabase, setFinalWorkout, setRoutine } = useContext(ActiveWorkoutContext);

    const totalWorkoutsCompleted = routine.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0;

    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        if (routine.id === 0) {
            setShowSaveModal(true);
        } else {
            saveWorkoutToDatabase(finalWorkout);
            setFinalWorkout({
                ...finalWorkout,
                routine: { ...routine, id: routine.id, title: routine.title },
                startTime: finalWorkout.startTime ?? null,
                endTime: finalWorkout.endTime ?? null,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routine.id]);

    const handleSaveRoutine = async (name: string) => {
        const newRoutineId = await addRoutineToDB({
            id: 0,
            title: name,
            exercises: routine.exercises,
        });

        if (typeof newRoutineId !== 'number') {
            return;
        }

        const updatedRoutine = { ...routine, id: newRoutineId, title: name };

        // Ensure startTime and endTime are never undefined
        const safeFinalWorkout = {
            ...finalWorkout,
            routine: updatedRoutine,
            startTime: finalWorkout.startTime ?? null,
            endTime: finalWorkout.endTime ?? null,
        };

        setRoutine(updatedRoutine);
        setFinalWorkout(safeFinalWorkout);
        await saveWorkoutToDatabase(safeFinalWorkout);
        setShowSaveModal(false);
    };

    const handleSkipSaveRoutine = async () => {
        // Save workout as ad-hoc (routineId will be null/0)
        await saveWorkoutToDatabase(finalWorkout);
        setShowSaveModal(false);
        // Optionally, show a success message or navigate away
    };

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

    // Animation state (if needed elsewhere)
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
    }, [scaleValue, opacityValue]);

    return {
        showSaveModal,
        handleSkipSaveRoutine,
        handleSaveRoutine,
        totalWorkoutsCompleted,
        finalTime,
        totalSets,
        totalWeightMoved,
        highestWeight,
        exerciseStats,
        // Optionally export animation refs if needed
        // scaleValue,
        // opacityValue,
    };
}
