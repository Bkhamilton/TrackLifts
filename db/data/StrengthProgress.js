/**
 * Get strength progress for a session or exercise.
 * @param {object} db - The database connection.
 * @param {number} sessionId - The session ID.
 * @param {number} exerciseId - (Optional) The exercise ID.
 * @returns {Promise<Array>} Array of { top_weight, total_volume, max_reps, estimated_1rm }
 */
export const getStrengthProgressBySession = async (db, sessionId) => {
    try {
        return await db.getAllAsync(
            `SELECT exercise_id, top_weight, total_volume, max_reps, estimated_1rm
             FROM StrengthProgress
             WHERE session_id = ?`,
            [sessionId]
        );
    } catch (error) {
        console.error('Error fetching strength progress:', error);
        throw error;
    }
};

export const getStrengthProgressByExercise = async (db, exerciseId) => {
    try {
        return await db.getAllAsync(
            `SELECT session_id, top_weight, total_volume, max_reps, estimated_1rm
             FROM StrengthProgress
             WHERE exercise_id = ?`,
            [exerciseId]
        );
    } catch (error) {
        console.error('Error fetching strength progress by exercise:', error);
        throw error;
    }
};