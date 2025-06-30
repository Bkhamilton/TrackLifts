/**
 * Get detailed session stats (weight/reps for each stat type) for a given exercise and user within a date range.
 * @param {object} db - The database instance.
 * @param {number} userId - The user ID.
 * @param {number} exerciseId - The exercise ID.
 * @param {string} startDate - Start date (YYYY-MM-DD).
 * @param {string} endDate - End date (YYYY-MM-DD).
 * @returns {Promise<Array>} Array of session stat details.
 */
export const getExerciseSessionStatDetails = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT workout_date,
                    heaviest_set_weight, heaviest_set_reps,
                    top_set_weight, top_set_reps,
                    most_reps_weight, most_reps_reps,
                    total_volume, avg_weight
             FROM ExerciseSessionStatDetails
             WHERE user_id = ?
               AND exercise_id = ?
               AND workout_date BETWEEN ? AND ?
             ORDER BY workout_date ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching exercise session stat details:', error);
        throw error;
    }
};

/**
 * Get all-time detailed stats for a given exercise and user.
 * @param {object} db - The database instance.
 * @param {number} userId - The user ID.
 * @param {number} exerciseId - The exercise ID.
 * @returns {Promise<Object|null>} All-time stat details.
 */
export const getAllTimeExerciseSessionStatDetails = async (db, userId, exerciseId) => {
    try {
        return await db.getFirstAsync(
            `SELECT
                MAX(heaviest_set_weight) AS heaviest_set_weight,
                MAX(heaviest_set_reps) AS heaviest_set_reps,
                MAX(top_set_weight * top_set_reps) AS top_set_value,
                MAX(top_set_weight) AS top_set_weight,
                MAX(top_set_reps) AS top_set_reps,
                MAX(most_reps_reps) AS most_reps_reps,
                MAX(most_reps_weight) AS most_reps_weight,
                SUM(total_volume) AS total_volume,
                AVG(avg_weight) AS avg_weight
             FROM ExerciseSessionStatDetails
             WHERE user_id = ?
               AND exercise_id = ?`,
            [userId, exerciseId]
        );
    } catch (error) {
        console.error('Error fetching all-time exercise session stat details:', error);
        throw error;
    }
};