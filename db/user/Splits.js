// Function to create a new split
export const insertSplit = async (db, split) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO Splits (name, user_id, is_active) VALUES (?, ?, ?)',
            [split.name, split.user_id, split.is_active]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating split:', error);
        throw error;
    }
};

// Function to get all splits for a user
export const getSplits = async (db, userId) => {
    try {
        const query = `
            SELECT 
                Splits.id, Splits.name, Splits.user_id, Splits.is_active
            FROM 
                Splits
            WHERE 
                Splits.user_id = ?`;
        const rows = await db.getAllAsync(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting splits by user ID:', error);
        throw error;
    }
};

// Function to get a split by ID
export const getSplitById = async (db, id) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM Splits WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting split by ID:', error);
        throw error;
    }
};

export const setNewActiveSplit = async (db, userId, splitId) => {
    await db.runAsync('UPDATE Splits SET is_active = 0 WHERE user_id = ?', [userId]);
    await db.runAsync('UPDATE Splits SET is_active = 1 WHERE id = ? AND user_id = ?', [splitId, userId]);
};

// Get the active split
export const getActiveSplit = async (db, userId) => {
    const rows = await db.getAllAsync('SELECT * FROM Splits WHERE user_id = ? AND is_active = 1', [userId]);
    return rows[0];
};

// Function to update a split by ID
export const updateSplit = async (db, split) => {
    try {
        await db.runAsync(
            'UPDATE Splits SET name = ?, user_id = ? WHERE id = ?',
            [split.name, split.user_id, split.id]
        );
        console.log('Split updated');
    } catch (error) {
        console.error('Error updating split:', error);
        throw error;
    }
};

// Function to delete a split by ID
export const deleteSplit = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM Splits WHERE id = ?', [id]);
        console.log('Split deleted');
    } catch (error) {
        console.error('Error deleting split:', error);
        throw error;
    }
};

export const clearSplit = async (db, userId, splitId) => {
    try {
        await db.runAsync('DELETE FROM Splits WHERE user_id = ? AND id = ?', [userId, splitId]);
        console.log('Split cleared');
    } catch (error) {
        console.error('Error clearing split:', error);
        throw error;
    }
}