export const getExercises = async (db) => {
    try {
        const query = `
            SELECT e.id, e.title, e.equipment_id, e.muscle_group_id, 
                   eq.name AS equipment, mg.name AS muscleGroup
            FROM Exercises e
            LEFT JOIN Equipment eq ON e.equipment_id = eq.id
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
        const { title, equipmentId, muscleGroupId } = exercise;
        const result = await db.runAsync(
            'INSERT INTO Exercises (title, equipment_id, muscle_group_id) VALUES (?, ?, ?)', 
            [title, equipmentId, muscleGroupId]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting exercise:', error);
        throw error;
    }
};

export const updateExercise = async (db, id, title, equipmentId, muscleGroupId) => {
    try {
        await db.runAsync(
            'UPDATE Exercises SET title = ?, equipment_id = ?, muscle_group_id = ? WHERE id = ?', 
            [title, equipmentId, muscleGroupId, id]
        );
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
