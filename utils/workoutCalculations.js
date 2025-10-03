export function calculateTotalWeight(history) {
    if (!history?.routine?.exercises) return 0;
    return history.routine.exercises.reduce((exerciseSum, exercise) => {
        if (!exercise.sets) return exerciseSum;
        const setsSum = exercise.sets.reduce((setSum, set) => {
            // Calculate effective weight based on equipment type
            let effectiveWeight = set.weight;
            
            // For Bodyweight and Assisted Bodyweight, we need user weight to calculate properly
            // Since we don't have user weight here, we'll use the absolute value of weight for now
            // This is mainly for display purposes
            if (exercise.equipment === 'Assisted Bodyweight') {
                // Use absolute value to avoid negative volume
                effectiveWeight = Math.abs(set.weight);
            }
            
            return setSum + (effectiveWeight * set.reps);
        }, 0);
        return exerciseSum + setsSum;
    }, 0);
}

export const calculateEstimated1RM = (weight, reps) => {
  return reps === 1 ? weight : weight * (1 + reps / 30);
};

export function calculateCaloriesBurned({
    weightLbs,
    durationMinutes,
    met = 4.5, // default for moderate weightlifting
}) {
    const weightKg = weightLbs * 0.453592;
    const durationHours = durationMinutes / 60;
    return met * weightKg * durationHours;
}