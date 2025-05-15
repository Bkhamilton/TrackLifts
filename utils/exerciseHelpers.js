import { getExerciseMuscleDetails } from '@/db/general/ExerciseMuscles';
import { getExercises } from '@/db/general/Exercises';

export const getExerciseData = async (db) => {
    // Fetch all routines for the user
    const exercises = await getExercises(db);
    if (!exercises) {
        return null; // Return null if no routines are found
    }

    // Fill the routine data with exercises
    const filledExercises = await fillExerciseData(db, exercises);
    return filledExercises; // Return the filled routines
}

export const fillExerciseData = async (db, exercises) => {
    const exercisesWithDetails = [];

    for (const exercise of exercises) {
        // Fetch details for the current exercise
        const muscles = await getExerciseMuscleDetails(db, exercise.id);

        // Add the details field to the exercise
        exercisesWithDetails.push({
            ...exercise, // Spread the existing exercise fields
            muscles,     // Add the details field
        });
    }

    return exercisesWithDetails; // Return the updated exercises array
}