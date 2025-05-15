export const getExerciseMuscles = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM ExerciseMuscles');
        return allRows;
    } catch (error) {
        console.error('Error getting exercise muscles:', error);
        throw error;
    }
};

export const getExerciseMuscleDetails = async (db, exerciseId) => {
    try {
        const query = `
            SELECT em.*, m.name AS muscle_name
            FROM ExerciseMuscles em
            JOIN Muscles m ON em.muscle_id = m.id
            WHERE em.exercise_id = ?
            `;
        const rows = await db.getAllAsync(
            query,
            [exerciseId]
        );
        return rows;
    } catch (error) {
        console.error('Error getting exercise muscle details:', error);
        throw error;
    }
}

export const insertExerciseMuscle = async (db, exerciseMuscle) => {
    const { exerciseId, muscleId, intensity } = exerciseMuscle;
    try {
        const result = await db.runAsync(
            'INSERT INTO ExerciseMuscles (exercise_id, muscle_id, intensity) VALUES (?, ?, ?)',
            [exerciseId, muscleId, intensity]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting exercise muscle:', error);
        throw error;
    }
};

export const updateExerciseMuscle = async (db, exerciseId, muscleId, intensity) => {
    try {
        await db.runAsync(
            'UPDATE ExerciseMuscles SET intensity = ? WHERE exercise_id = ? AND muscle_id = ?',
            [intensity, exerciseId, muscleId]
        );
        console.log('Exercise muscle updated');
    } catch (error) {
        console.error('Error updating exercise muscle:', error);
        throw error;
    }
};

export const deleteExerciseMuscle = async (db, exerciseId, muscleId) => {
    try {
        await db.runAsync(
            'DELETE FROM ExerciseMuscles WHERE exercise_id = ? AND muscle_id = ?',
            [exerciseId, muscleId]
        );
    } catch (error) {
        console.error('Error deleting exercise muscle:', error);
        throw error;
    }
};
