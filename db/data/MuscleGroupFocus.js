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

export const getTotalMuscleGroupFocus = async (db) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_group, SUM(intensity_score) AS total_intensity FROM MuscleGroupFocus GROUP BY muscle_group'
        );
    } catch (error) {
        console.error('Error fetching total muscle group focus:', error);
        throw error;
    }
}