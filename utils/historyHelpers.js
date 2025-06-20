import { getSessionExercisesBySessionId } from '@/db/workout/SessionExercises';
import { getSessionExerciseDetails } from '@/db/workout/SessionSets';
import { getWorkoutSessions } from '@/db/workout/WorkoutSessions';

export const getHistoryData = async (db, userId) => {
    // Fetch all routines for the user
    const workoutSessions = await getWorkoutSessions(db, userId);

    if (!workoutSessions) {
        return null; // Return null if no workout sessions are found
    }

    // Fill the routine data with exercises
    const filledSessions = await fillSessionData(db, workoutSessions);
    return filledSessions; // Return the filled routines
}

export const fillSessionData = async (db, workoutSessions) => {
    const workoutSessionsWithExercises = [];

    for (const workoutSession of workoutSessions) {
        // Fetch exercises for the current workout session
        const exercises = await getSessionExercisesBySessionId(db, workoutSession.id);
        const exercisesWithDetails = await fillExerciseData(db, exercises);

        // Destructure to remove routine_id and routineName/routineTitle from the outer object
        const {
            routineId,
            routineTitle,
            ...rest
        } = workoutSession;

        workoutSessionsWithExercises.push({
            ...rest,
            routine: {
                id: routineId,
                title: routineTitle,
                exercises: exercisesWithDetails,
            },
        });
    }

    return workoutSessionsWithExercises;
}

export const fillExerciseData = async (db, exercises) => {
    const exercisesWithDetails = [];

    for (const exercise of exercises) {
        // Fetch details for the current exercise
        const sets = await getSessionExerciseDetails(db, exercise.id);

        // Add the details field to the exercise
        exercisesWithDetails.push({
            ...exercise, // Spread the existing exercise fields
            sets,     // Add the details field
        });
    }

    return exercisesWithDetails; // Return the updated exercises array
}
