/**
 * Get favorite routines for a user, ordered by usage.
 * @param {object} db - The database connection.
 * @param {number} userId - The user's ID.
 * @returns {Promise<Array>} Array of { routine_id, routine_title, usage_count, last_used }
 */
export const getFavoriteRoutinesByUser = async (db, userId) => {
    try {
        return await db.getAllAsync(
            `SELECT routine_id, routine_title, usage_count, last_used
             FROM FavoriteRoutines
             WHERE user_id = ?
             ORDER BY usage_count DESC, last_used DESC`,
            [userId]
        );
    } catch (error) {
        console.error('Error fetching favorite routines:', error);
        throw error;
    }
};