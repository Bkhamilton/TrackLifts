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

        // Add the exercises field to the routine
        routinesWithExercises.push({
            ...routine, // Spread the existing routine fields
            exercises,  // Add the exercises field
        });
    }

    return routinesWithExercises; // Return the updated routines array
};