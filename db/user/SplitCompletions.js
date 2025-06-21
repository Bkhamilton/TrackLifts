// Function to create a new SplitCompletion
export const insertSplitCompletion = async (db, splitCompletion) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO SplitCompletions (user_id, split_id, completion_date, completed_cycles) VALUES (?, ?, ?, ?)',
            [
                splitCompletion.user_id,
                splitCompletion.split_id,
                splitCompletion.completion_date || null,
                splitCompletion.completed_cycles || 1
            ]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating SplitCompletion:', error);
        throw error;
    }
};

// Function to get a SplitCompletion by ID
export const getSplitCompletionById = async (db, id) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM SplitCompletions WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting SplitCompletion by ID:', error);
        throw error;
    }
};

// Function to update a SplitCompletion by ID
export const updateSplitCompletion = async (db, splitCompletion) => {
    try {
        await db.runAsync(
            'UPDATE SplitCompletions SET user_id = ?, split_id = ?, completion_date = ?, completed_cycles = ? WHERE id = ?',
            [
                splitCompletion.user_id,
                splitCompletion.split_id,
                splitCompletion.completion_date,
                splitCompletion.completed_cycles,
                splitCompletion.id
            ]
        );
    } catch (error) {
        console.error('Error updating SplitCompletion:', error);
        throw error;
    }
};

// Function to delete a SplitCompletion by ID
export const deleteSplitCompletion = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM SplitCompletions WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting SplitCompletion:', error);
        throw error;
    }
};
