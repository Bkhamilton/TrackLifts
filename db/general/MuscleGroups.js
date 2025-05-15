// Function to get all muscle groups
export const getMuscleGroups = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM MuscleGroups');
        return allRows;
    } catch (error) {
        console.error('Error getting muscle groups:', error);
        throw error;
    }
};

export const getMuscleGroupIdByName = async (db, name) => {
    try {
        const result = await db.getAllAsync('SELECT id FROM MuscleGroups WHERE name = ?', [name]);
        return result ? result[0].id : null;
    } catch (error) {
        console.error('Error getting muscle group ID by name:', error);
        throw error;
    }
}

// Function to insert a muscle group
export const insertMuscleGroup = async (db, name) => {
    try {
        const result = await db.runAsync('INSERT INTO MuscleGroups (name) VALUES (?)', [name]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting muscle group:', error);
        throw error;
    }
};

// Function to update a muscle group
export const updateMuscleGroup = async (db, id, name) => {
    try {
        await db.runAsync('UPDATE MuscleGroups SET name = ? WHERE id = ?', [name, id]);
        console.log('Muscle group updated');
    } catch (error) {
        console.error('Error updating muscle group:', error);
        throw error;
    }
};

// Function to delete a muscle group
export const deleteMuscleGroup = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM MuscleGroups WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting muscle group:', error);
        throw error;
    }
};
