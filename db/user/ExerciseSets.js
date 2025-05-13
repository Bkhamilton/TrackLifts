// Create a new exercise set
export const insertExerciseSet = async (db, exerciseSet) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO ExerciseSets (routine_exercise_id, weight, reps, date) VALUES (?, ?, ?, ?)',
            [exerciseSet.routine_exercise_id, exerciseSet.weight, exerciseSet.reps, exerciseSet.date]
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
            SELECT es.*, re.id AS routine_exercise_id, re.routine_id, re.exercise_id, e.name AS exercise_name
            FROM ExerciseSets es
            JOIN RoutineExercises re ON es.routine_exercise_id = re.id
            JOIN Exercises e ON re.exercise_id = e.id
            WHERE es.routine_exercise_id = ?`
        const allRows = await db.getAllAsync(
            'SELECT * FROM ExerciseSets WHERE routine_exercise_id = ?',
            [routine_exercise_id]
        );
        console.log('Exercise details:', allRows);
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
