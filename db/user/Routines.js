// Function to create a new routine
export const insertRoutine = async (db, routine) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO Routines (title, user_id) VALUES (?, ?)',
            [routine.title, routine.user_id]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating routine:', error);
        throw error;
    }
};

// Function to get all routines for a user
export const getRoutinesByUserId = async (db, userId) => {
    try {
        const query = `
            SELECT Routines.id, Routines.title, Routines.user_id
            FROM Routines
            WHERE Routines.user_id = ?`
        const rows = await db.getAllAsync(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting routines by user ID:', error);
        throw error;
    }
};

// Function to get a routine by ID
export const getRoutineById = async (db, id) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM Routines WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting routine by ID:', error);
        throw error;
    }
};

// Function to get routine by title
export const getRoutineByTitle = async (db, title) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM Routines WHERE title = ?', [title]);
        return rows[0];
    } catch (error) {
        console.error('Error getting routine by title:', error);
        throw error;
    }
}

// Function to update a routine by ID
export const updateRoutine = async (db, routine) => {
    try {
        await db.runAsync(
            'UPDATE Routines SET title = ?, user_id = ? WHERE id = ?',
            [routine.title, routine.user_id, routine.id]
        );
        console.log('Routine updated');
    } catch (error) {
        console.error('Error updating routine:', error);
        throw error;
    }
};

// Function to delete a routine by ID
export const deleteRoutine = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM Routines WHERE id = ?', [id]);
        console.log('Routine deleted');
    } catch (error) {
        console.error('Error deleting routine:', error);
        throw error;
    }
};
