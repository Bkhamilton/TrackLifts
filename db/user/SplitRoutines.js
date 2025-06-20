// Function to create a new SplitRoutine
export const insertSplitRoutine = async (db, splitRoutine) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO SplitRoutines (split_id, split_order, routine_id) VALUES (?, ?, ?)',
            [splitRoutine.split_id, splitRoutine.split_order, splitRoutine.routine_id]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating SplitRoutine:', error);
        throw error;
    }
};

// Function to get all SplitRoutines for a split with routine titles
export const getSplitRoutines = async (db, splitId) => {
    try {
        const query = `
            SELECT 
                SplitRoutines.id, 
                SplitRoutines.split_id, 
                SplitRoutines.split_order as day, 
                SplitRoutines.routine_id, 
                Routines.title AS routine
            FROM 
                SplitRoutines
            JOIN 
                Routines ON SplitRoutines.routine_id = Routines.id
            WHERE 
                SplitRoutines.split_id = ?`;
        const rows = await db.getAllAsync(query, [splitId]);
        return rows;
    } catch (error) {
        console.error('Error getting SplitRoutines by split ID with routine titles:', error);
        throw error;
    }
};

// Function to get a SplitRoutine by ID
export const getSplitRoutineById = async (db, id) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM SplitRoutines WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting SplitRoutine by ID:', error);
        throw error;
    }
};

// Function to update a SplitRoutine by ID
export const updateSplitRoutine = async (db, splitRoutine) => {
    try {
        await db.runAsync(
            'UPDATE SplitRoutines SET split_id = ?, split_order = ?, routine_id = ? WHERE id = ?',
            [splitRoutine.split_id, splitRoutine.split_order, splitRoutine.routine_id, splitRoutine.id]
        );
    } catch (error) {
        console.error('Error updating SplitRoutine:', error);
        throw error;
    }
};

// Function to delete a SplitRoutine by ID
export const deleteSplitRoutine = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM SplitRoutines WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting SplitRoutine:', error);
        throw error;
    }
};

export const clearSplitRoutines = async (db, splitId) => {
    try {
        await db.runAsync('DELETE FROM SplitRoutines WHERE split_id = ?', [splitId]);
    } catch (error) {
        console.error('Error clearing SplitRoutines:', error);
        throw error;
    }
}