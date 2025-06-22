export const calculateStreak = (workoutFrequency: { workout_date: string, session_count: number }[]) => {
    if (!workoutFrequency || workoutFrequency.length === 0) return 0;

    // Sort by date
    const sortedFrequency = [...workoutFrequency].sort((a, b) => new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime());

    let streak = 1;
    let lastDate = new Date(sortedFrequency[0].workout_date);

    for (let i = 1; i < sortedFrequency.length; i++) {
        const currentDate = new Date(sortedFrequency[i].workout_date);
        const diffDays = Math.ceil((lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
            streak++;
        } else if (diffDays > 1) {
            break; // Streak broken
        }

        lastDate = currentDate;
    }

    return streak;
}

export const calculateLastWorkout = (workoutFrequency: { workout_date: string, session_count: number }[]) => {
    if (!workoutFrequency || workoutFrequency.length === 0) return "N/A";
    // Sort by date
    const sortedFrequency = [...workoutFrequency].sort((a, b) => new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime());
    const lastWorkoutDate = new Date(sortedFrequency[0].workout_date);

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays} days ago`;
}

// Function to calculate workout frequency of the last week
export const calculateWeeklyFrequency = (workoutHistory: { workout_date: string, session_count: number }[]) => {
    if (!workoutHistory || workoutHistory.length === 0) return "0 times/week";

    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const recentWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.workout_date);
        return workoutDate >= oneWeekAgo && workoutDate <= today;
    });

    const totalSessions = recentWorkouts.reduce((acc, workout) => acc + workout.session_count, 0);
    return `${totalSessions} times/week`;
}