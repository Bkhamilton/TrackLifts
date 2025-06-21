export function calculateTotalWeight(history) {
    if (!history?.routine?.exercises) return 0;
    return history.routine.exercises.reduce((exerciseSum, exercise) => {
        if (!exercise.sets) return exerciseSum;
        const setsSum = exercise.sets.reduce((setSum, set) => {
            return setSum + (set.weight * set.reps);
        }, 0);
        return exerciseSum + setsSum;
    }, 0);
}