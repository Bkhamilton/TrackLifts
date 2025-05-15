export const getMuscles = async (db) => {
    try {
        const query = `
            SELECT 
                m.*, 
                mg.name AS muscleGroup
            FROM 
                Muscles m
            LEFT JOIN 
                MuscleGroups mg 
            ON 
                m.muscle_group_id = mg.id
            `;
        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting muscles:', error);
        throw error;
    }
};

export const insertMuscle = async (db, muscle) => {
    try {
        const result = await db.runAsync('INSERT INTO Muscles (name, muscle_group_id) VALUES (?, ?)', [muscle.name, muscle.muscleGroupId]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting muscle:', error);
        throw error;
    }
};

export const updateMuscle = async (db, muscle) => {
    try {
        await db.runAsync('UPDATE Muscles SET name = ?, muscle_group_id = ? WHERE id = ?', [muscle.name, muscle.muscleGroupId, muscle.id]);
        console.log('Muscle updated');
    } catch (error) {
        console.error('Error updating muscle:', error);
        throw error;
    }
};

export const deleteMuscle = async (db, muscleId) => {
    try {
        await db.runAsync('DELETE FROM Muscles WHERE id = ?', [muscleId]);
    } catch (error) {
        console.error('Error deleting muscle:', error);
        throw error;
    }
};
