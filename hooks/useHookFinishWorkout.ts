import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { RoutineContext } from '@/contexts/RoutineContext';
import { SplitContext } from '@/contexts/SplitContext';
import { WorkoutContext } from '@/contexts/WorkoutContext';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export default function useHookFinishWorkout() {
    const { 
        routine, 
        routine: completedRoutine,
        finalTime, 
        saveWorkoutToDatabase, 
        clearRoutine, 
        finalWorkout, 
        setFinalWorkout, 
        setRoutine 
    } = useContext(ActiveWorkoutContext);
    const { addRoutineToDB } = useContext(RoutineContext);
    const { refreshHistory } = useContext(WorkoutContext);
    const { activeSplit, getCurrentSplitDay, completeCurrentSplitDay } = useContext(SplitContext);

    const router = useRouter();

    const totalWorkoutsCompleted = routine.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0;

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showRoutineMismatchModal, setShowRoutineMismatchModal] = useState(false);
    const [routineOptions, setRoutineOptions] = useState<any[]>([]);
    const [expectedRoutine, setExpectedRoutine] = useState<any>(null);
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
    const [notes, setNotes] = useState(finalWorkout?.notes || '');        

    useEffect(() => {
        if (routine.id === 0) {
            setShowSaveModal(true);
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
        setShowSaveModal(false);
    };

    const handleSkipSaveRoutine = async () => {
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

    // This function checks and handles split completion logic
    const handleSplitCompletion = async () => {
        if (!activeSplit) return;
        const dayIndex = await getCurrentSplitDay();
        const routinesSorted = [...activeSplit.routines].sort((a, b) => a.day - b.day);
        const expected = routinesSorted[dayIndex];
        setExpectedRoutine(expected);

        // If the completed routine matches the expected routine, just complete the day
        if (completedRoutine.id === expected.routine_id) {
            await completeCurrentSplitDay();
            return true; // No modal needed
        } else {
            // Show modal to ask user which routine it most resembles
            setRoutineOptions(routinesSorted);
            setShowRoutineMismatchModal(true);
            return false; // Modal will handle completion
        }
    };

    // Call this after user selects a routine in the modal
    const handleRoutineSelection = async () => {
        // You can store the user's selection in a log if you want for analytics
        // For now, just complete the split day
        await completeCurrentSplitDay();
        setShowRoutineMismatchModal(false);
    };

    const handleDone = async () => {
        // Build safeFinalWorkout with notes
        try {
            const safeFinalWorkout = {
                ...finalWorkout,
                notes: notes,
            };
            await saveWorkoutToDatabase(safeFinalWorkout);
            refreshHistory();

            // Handle split completion logic
            const completedNormally = await handleSplitCompletion();
            if (completedNormally) {
                clearRoutine();
                router.replace('/(tabs)/(index)');
            }
            // If the split completion logic required user input, it will handle that in the modal
        } catch (error) {
            console.error('Error saving workout:', error);
        }
        router.replace('/(tabs)/(index)');
    };    

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
        finalWorkout,
        setFinalWorkout,
        notes,
        setNotes,
        completedRoutine,
        showRoutineMismatchModal,
        setShowRoutineMismatchModal,
        routineOptions,
        expectedRoutine,
        selectedRoutineId,
        setSelectedRoutineId,
        handleSplitCompletion,
        handleRoutineSelection,
        handleDone,
    };
}