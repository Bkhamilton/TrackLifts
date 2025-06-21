/**
 * Get workout frequency for a user (sessions per day).
 * @param {object} db - The database connection.
 * @param {number} userId - The user's ID.
 * @returns {Promise<Array>} Array of { workout_date, session_count }
 */
export const getWorkoutFrequencyByUser = async (db, userId) => {
    try {
        return await db.getAllAsync(
            'SELECT workout_date, session_count FROM WorkoutFrequency WHERE user_id = ? ORDER BY workout_date DESC',
            [userId]
        );
    } catch (error) {
        console.error('Error fetching workout frequency:', error);
        throw error;
    }
};