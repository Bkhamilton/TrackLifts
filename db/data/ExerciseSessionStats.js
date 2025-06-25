// db/data/ExerciseSessionStats.js

/**
 * Get all session stats for a given exercise and user within a date range.
 * @param {object} db - The database instance.
 * @param {number} userId - The user ID.
 * @param {number} exerciseId - The exercise ID.
 * @param {string} startDate - Start date (YYYY-MM-DD).
 * @param {string} endDate - End date (YYYY-MM-DD).
 * @returns {Promise<Array>} Array of session stats.
 */
export const getExerciseSessionStats = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT workout_date, heaviest_set, top_set, total_volume, avg_weight, most_reps
             FROM ExerciseSessionStats
             WHERE user_id = ?
               AND exercise_id = ?
               AND workout_date BETWEEN ? AND ?
             ORDER BY workout_date ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching exercise session stats:', error);
        throw error;
    }
};

/**
 * Get the latest session stat for a given exercise and user.
 * @param {object} db - The database instance.
 * @param {number} userId - The user ID.
 * @param {number} exerciseId - The exercise ID.
 * @returns {Promise<Object|null>} Latest session stat or null.
 */
export const getLatestExerciseSessionStat = async (db, userId, exerciseId) => {
    try {
        const result = await db.getFirstAsync(
            `SELECT workout_date, heaviest_set, top_set, total_volume, avg_weight, most_reps
             FROM ExerciseSessionStats
             WHERE user_id = ?
               AND exercise_id = ?
             ORDER BY workout_date DESC
             LIMIT 1`,
            [userId, exerciseId]
        );
        return result || null;
    } catch (error) {
        console.error('Error fetching latest exercise session stat:', error);
        throw error;
    }
};