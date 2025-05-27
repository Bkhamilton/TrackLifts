import { getExerciseDetails } from '@/db/user/ExerciseSets';
import { getRoutineExercises } from '@/db/user/RoutineExercises';
import { getRoutinesByUserId } from '@/db/user/Routines';

export const getRoutineData = async (db, userId) => {
    // Fetch all routines for the user
    const routines = await getRoutinesByUserId(db, userId);
    if (!routines) {
        return null; // Return null if no routines are found
    }

    // Fill the routine data with exercises
    const filledRoutines = await fillRoutineData(db, routines);
    return filledRoutines; // Return the filled routines
}

export const fillRoutineData = async (db, routines) => {
    const routinesWithExercises = [];

    for (const routine of routines) {
        // Fetch exercises for the current routine
        const exercises = await getRoutineExercises(db, routine.id);

        const exercisesWithDetails = await fillExerciseData(db, exercises);
        // Add the exercises field to the routine
        routinesWithExercises.push({
            ...routine, // Spread the existing routine fields
            exercises: exercisesWithDetails,  // Add the exercises field
        });
    }

    return routinesWithExercises; // Return the updated routines array
};

export const fillExerciseData = async (db, exercises) => {
    const exercisesWithDetails = [];

    for (const exercise of exercises) {
        // Fetch details for the current exercise
        const sets = await getExerciseDetails(db, exercise.id);

        // Add the details field to the exercise
        exercisesWithDetails.push({
            ...exercise, // Spread the existing exercise fields
            sets,     // Add the details field
        });
    }

    return exercisesWithDetails; // Return the updated exercises array
}

export const updateRoutineData = async (db, routineId, updatedData) => {
    // Need to update RoutineExercises and ExerciseSets based on updatedData
    for (const exercise of updatedData.exercises) {
        // Update each exercise in the routine
        const exerciseId = exercise.id;
        const sets = exercise.sets || [];

    }
    return updatedData;
}