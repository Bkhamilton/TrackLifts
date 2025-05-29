// Function to create a new split
export const insertSplit = async (db, split) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO Splits (name, user_id) VALUES (?, ?)',
            [split.name, split.user_id]
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
                Splits.id, Splits.name, Splits.user_id
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
