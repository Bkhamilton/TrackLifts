// Function to insert a new ExerciseMaxHistory record
export const insertExerciseMaxHistory = async (db, record) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO ExerciseMaxHistory (user_id, exercise_id, one_rep_max, calculation_date)
             VALUES (?, ?, ?, ?)`,
            [
                record.user_id,
                record.exercise_id,
                record.one_rep_max,
                record.calculation_date || new Date().toISOString()
            ]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting ExerciseMaxHistory:', error);
        throw error;
    }
};

// Function to get all ExerciseMaxHistory records for a user
export const getAllExerciseMaxHistory = async (db, userId) => {
    const rows = await db.getAllAsync(
        `SELECT * FROM ExerciseMaxHistory WHERE user_id = ?`,
        [userId]
    );
    return rows;
};

// Function to get the maximum one-rep max for a user and exercise
export const getPreviousMax1RM = async (db, userId, exerciseId) => {
    const rows = await db.getAllAsync(
        `SELECT MAX(one_rep_max) as max1RM FROM ExerciseMaxHistory WHERE user_id = ? AND exercise_id = ?`,
        [userId, exerciseId]
    );
    return rows[0]?.max1RM || 0;
};

// Function to get an ExerciseMaxHistory record by ID
export const getExerciseMaxHistoryById = async (db, id) => {
    try {
        const rows = await db.getAllAsync(
            'SELECT * FROM ExerciseMaxHistory WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error getting ExerciseMaxHistory by ID:', error);
        throw error;
    }
};

// Function to update an ExerciseMaxHistory record by ID
export const updateExerciseMaxHistory = async (db, record) => {
    try {
        await db.runAsync(
            `UPDATE ExerciseMaxHistory
             SET user_id = ?, exercise_id = ?, one_rep_max = ?, calculation_date = ?
             WHERE id = ?`,
            [
                record.user_id,
                record.exercise_id,
                record.one_rep_max,
                record.calculation_date,
                record.id
            ]
        );
    } catch (error) {
        console.error('Error updating ExerciseMaxHistory:', error);
        throw error;
    }
};

// Function to delete an ExerciseMaxHistory record by ID
export const deleteExerciseMaxHistory = async (db, id) => {
    try {
        await db.runAsync(
            'DELETE FROM ExerciseMaxHistory WHERE id = ?',
            [id]
        );
    } catch (error) {
        console.error('Error deleting ExerciseMaxHistory:', error);
        throw error;
    }
};
