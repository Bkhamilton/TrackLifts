export const getExercises = async (db) => {
    try {
        const query = `
            SELECT e.id, e.title, e.muscle_group_id, mg.name AS muscle_group_title
            FROM Exercises e
            LEFT JOIN MuscleGroups mg ON e.muscle_group_id = mg.id
            ORDER BY e.title
            `;

        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting exercises:', error);
        throw error;
    }
};

export const insertExercise = async (db, exercise) => {
    try {
        const { title, muscleGroupId } = exercise;
        const result = await db.runAsync('INSERT INTO Exercises (title, muscle_group_id) VALUES (?, ?)', [title, muscleGroupId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting exercise:', error);
        throw error;
    }
};

export const updateExercise = async (db, id, title, muscleGroupId) => {
    try {
        await db.runAsync('UPDATE Exercises SET title = ?, muscle_group_id = ? WHERE id = ?', [title, muscleGroupId, id]);
        console.log('Exercise updated');
    } catch (error) {
        console.error('Error updating exercise:', error);
        throw error;
    }
};

export const deleteExercise = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM Exercises WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error;
    }
};
