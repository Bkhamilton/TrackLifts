/**
 * Get muscle group focus for a session.
 * @param {object} db - The database connection.
 * @param {number} sessionId - The session ID.
 * @returns {Promise<Array>} Array of { muscle_group, intensity_score }
 */
export const getMuscleGroupFocusBySession = async (db, sessionId) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_group, intensity_score FROM MuscleGroupFocus WHERE session_id = ?',
            [sessionId]
        );
    } catch (error) {
        console.error('Error fetching muscle group focus:', error);
        throw error;
    }
};