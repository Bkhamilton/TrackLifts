// Create a new exercise set
export const insertExerciseSet = async (db, exerciseSet) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO ExerciseSets (routine_exercise_id, set_order, weight, reps, date) VALUES (?, ?, ?, ?, ?)',
            [exerciseSet.routine_exercise_id, exerciseSet.set_order, exerciseSet.weight, exerciseSet.reps, exerciseSet.date]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating exercise set:', error);
        throw error;
    }
};

export const getExerciseDetails = async (db, routine_exercise_id) => {
    try {
        const query = `
            SELECT 
                es.*, 
                re.id AS routine_exercise_id, 
                re.routine_id, 
                re.exercise_id, 
                e.title AS exercise_name
            FROM 
                ExerciseSets es
            JOIN 
                RoutineExercises re ON es.routine_exercise_id = re.id
            JOIN 
                Exercises e ON re.exercise_id = e.id
            WHERE 
                es.routine_exercise_id = ?`
        const allRows = await db.getAllAsync(
            query,
            [routine_exercise_id]
        );
        return allRows;
    } catch (error) {
        console.error('Error getting exercise details:', error);
        throw error;
    }
}

// Read exercise sets by routine exercise ID
export const getExerciseSetsByRoutineExerciseId = async (db, routineExerciseId) => {
    try {
        const allRows = await db.getAllAsync(
            'SELECT * FROM ExerciseSets WHERE routine_exercise_id = ?',
            [routineExerciseId]
        );
        return allRows;
    } catch (error) {
        console.error('Error getting exercise sets:', error);
        throw error;
    }
};

// Update an exercise set by ID
export const updateExerciseSet = async (db, id, updates) => {
    try {
        await db.runAsync(
            'UPDATE ExerciseSets SET weight = ?, reps = ?, date = ? WHERE id = ?',
            [updates.weight, updates.reps, updates.date, id]
        );
        console.log('Exercise set updated');
    } catch (error) {
        console.error('Error updating exercise set:', error);
        throw error;
    }
};

// Delete an exercise set by ID
export const deleteExerciseSet = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM ExerciseSets WHERE id = ?', [id]);
        console.log('Exercise set deleted');
    } catch (error) {
        console.error('Error deleting exercise set:', error);
        throw error;
    }
};

export const deleteExerciseSetsByRoutineId = async (db, routineId) => {
    try {
        // Find all routine_exercise_ids associated with the given routineId
        const routineExerciseIds = await db.getAllAsync(
            'SELECT id FROM RoutineExercises WHERE routine_id = ?',
            [routineId]
        );

        // Extract the IDs into an array
        const ids = routineExerciseIds.map(row => row.id);

        if (ids.length > 0) {
            // Delete all ExerciseSets with matching routine_exercise_ids
            await db.runAsync(
                `DELETE FROM ExerciseSets WHERE routine_exercise_id IN (${ids.join(',')})`
            );
            console.log(`Deleted ExerciseSets for routineId: ${routineId}`);
        } else {
            console.log(`No ExerciseSets found for routineId: ${routineId}`);
        }
    } catch (error) {
        console.error('Error deleting ExerciseSets by routineId:', error);
        throw error;
    }
};

export const deleteExerciseSetsByExerciseId = async (db, exerciseId) => {
    try {
        // Find all routine_exercise_ids associated with the given exerciseId
        const routineExerciseIds = await db.getAllAsync(
            'SELECT id FROM RoutineExercises WHERE exercise_id = ?',
            [exerciseId]
        );

        // Extract the IDs into an array
        const ids = routineExerciseIds.map(row => row.id);

        if (ids.length > 0) {
            // Delete all ExerciseSets with matching routine_exercise_ids
            await db.runAsync(
                `DELETE FROM ExerciseSets WHERE routine_exercise_id IN (${ids.join(',')})`
            );
            console.log(`Deleted ExerciseSets for exerciseId: ${exerciseId}`);
        } else {
            console.log(`No ExerciseSets found for exerciseId: ${exerciseId}`);
        }
    } catch (error) {
        console.error('Error deleting ExerciseSets by exerciseId:', error);
        throw error;
    }
};

export const clearExerciseSets = async (db, routineId, exerciseId) => {
    try {
        // Delete all ExerciseSets for the given routineId and exerciseId
        await db.runAsync(
            'DELETE FROM ExerciseSets WHERE routine_exercise_id IN (SELECT id FROM RoutineExercises WHERE routine_id = ? AND exercise_id = ?)',
            [routineId, exerciseId]
        );
        console.log('Exercise sets cleared');
    } catch (error) {
        console.error('Error clearing exercise sets:', error);
        throw error;
    }
}