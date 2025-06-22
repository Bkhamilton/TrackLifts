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

// Get all completions for a user and split
export const getSplitCompletionsForUser = async (db, user_id, split_id) => {
    try {
        const rows = await db.getAllAsync(
            'SELECT * FROM SplitCompletions WHERE user_id = ? AND split_id = ? ORDER BY completion_date ASC',
            [user_id, split_id]
        );
        return rows;
    } catch (error) {
        console.error('Error getting SplitCompletions for user:', error);
        throw error;
    }
};

// Get the current day index in the split cycle
export const getCurrentSplitDayIndex = async (db, user_id, split_id) => {
    const completions = await getSplitCompletionsForUser(db, user_id, split_id);
    // Count total completions
    let totalDays = 0;
    for (const c of completions) {
        totalDays += c.completed_cycles || 1;
    }
    return totalDays;
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
