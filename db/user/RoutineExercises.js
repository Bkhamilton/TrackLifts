// Create a new routine exercise
export const insertRoutineExercise = async (db, routineExercise) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO RoutineExercises (routine_id, exercise_id, sets) VALUES (?, ?, ?)', 
            [routineExercise.routine_id, routineExercise.exercise_id, routineExercise.sets]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating routine exercise:', error);
        throw error;
    }
};

// Read routine exercises by routine ID
export const getRoutineExercises = async (db, routineId) => {
    try {
        const query = `
            SELECT 
                re.*, 
                e.title, 
                eq.name as equipment,
                mg.name as muscleGroup
            FROM 
                RoutineExercises re
            LEFT JOIN 
                Exercises e ON re.exercise_id = e.id
            LEFT JOIN 
                Equipment eq ON e.equipment_id = eq.id
            LEFT JOIN
                MuscleGroups mg ON e.muscle_group_id = mg.id
            WHERE re.routine_id = ?`;
        const allRows = await db.getAllAsync(query, [routineId]);
        return allRows;
    } catch (error) {
        console.error('Error getting routine exercises:', error);
        throw error;
    }
};

// Read routine exercises by routine ID
export const getRoutineExercisesByRoutineId = async (db, routineId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM RoutineExercises WHERE routine_id = ?', [routineId]);
        return allRows;
    } catch (error) {
        console.error('Error getting routine exercises:', error);
        throw error;
    }
};

// Update a routine exercise
export const updateRoutineExercise = async (db, routineId, exerciseId, updates) => {
    try {
        await db.runAsync(
            'UPDATE RoutineExercises SET sets = ?, reps = ? WHERE routine_id = ? AND exercise_id = ?',
            [updates.sets, updates.reps, routineId, exerciseId]
        );
        console.log('Routine exercise updated');
    } catch (error) {
        console.error('Error updating routine exercise:', error);
        throw error;
    }
};

// Delete a routine exercise
export const deleteRoutineExercise = async (db, routineId, exerciseId) => {
    try {
        await db.runAsync('DELETE FROM RoutineExercises WHERE routine_id = ? AND exercise_id = ?', [routineId, exerciseId]);
    } catch (error) {
        console.error('Error deleting routine exercise:', error);
        throw error;
    }
};

export const deleteRoutineExerciseByRoutineId = async (db, routineId) => {
    try {
        await db.runAsync('DELETE FROM RoutineExercises WHERE routine_id = ?', [routineId]);
    } catch (error) {
        console.error('Error deleting routine exercises by routine ID:', error);
        throw error;
    }
}
