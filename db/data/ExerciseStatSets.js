/**
 * Get the "heaviest set" for each session for a given exercise and user in a date range.
 * @param {object} db
 * @param {number} userId
 * @param {number} exerciseId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const getHeaviestSets = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT session_id, workout_date, exercise_id, set_id, weight, reps
             FROM ExerciseStatSets
             WHERE user_id = ?
               AND exercise_id = ?
               AND workout_date BETWEEN ? AND ?
               AND is_heaviest_set = 1
             ORDER BY workout_date ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching heaviest sets:', error);
        throw error;
    }
};

/**
 * Get the "top set" (max weight * reps) for each session for a given exercise and user in a date range.
 * @param {object} db
 * @param {number} userId
 * @param {number} exerciseId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const getTopSets = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT session_id, workout_date, exercise_id, set_id, weight, reps
             FROM ExerciseStatSets
             WHERE user_id = ?
               AND exercise_id = ?
               AND workout_date BETWEEN ? AND ?
               AND is_top_set = 1
             ORDER BY workout_date ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching top sets:', error);
        throw error;
    }
};

/**
 * Get the "most reps" set for each session for a given exercise and user in a date range.
 * @param {object} db
 * @param {number} userId
 * @param {number} exerciseId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const getMostRepsSets = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT session_id, workout_date, exercise_id, set_id, weight, reps
             FROM ExerciseStatSets
             WHERE user_id = ?
               AND exercise_id = ?
               AND workout_date BETWEEN ? AND ?
               AND is_most_reps_set = 1
             ORDER BY workout_date ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching most reps sets:', error);
        throw error;
    }
};

/**
 * Get total volume per session for a given exercise and user in a date range.
 * @param {object} db
 * @param {number} userId
 * @param {number} exerciseId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const getTotalVolumePerSession = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT ws.id AS session_id, ws.start_time AS workout_date, se.exercise_id,
                    SUM(ss.weight * ss.reps) AS total_volume
             FROM WorkoutSessions ws
             JOIN SessionExercises se ON ws.id = se.session_id
             JOIN SessionSets ss ON se.id = ss.session_exercise_id
             WHERE ws.user_id = ?
               AND se.exercise_id = ?
               AND ws.start_time BETWEEN ? AND ?
             GROUP BY ws.id, se.exercise_id
             ORDER BY ws.start_time ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching total volume per session:', error);
        throw error;
    }
};

/**
 * Get average weight per session for a given exercise and user in a date range.
 * @param {object} db
 * @param {number} userId
 * @param {number} exerciseId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const getAverageWeightPerSession = async (db, userId, exerciseId, startDate, endDate) => {
    try {
        return await db.getAllAsync(
            `SELECT ws.id AS session_id, ws.start_time AS workout_date, se.exercise_id,
                    AVG(ss.weight) AS avg_weight
             FROM WorkoutSessions ws
             JOIN SessionExercises se ON ws.id = se.session_id
             JOIN SessionSets ss ON se.id = ss.session_exercise_id
             WHERE ws.user_id = ?
               AND se.exercise_id = ?
               AND ws.start_time BETWEEN ? AND ?
             GROUP BY ws.id, se.exercise_id
             ORDER BY ws.start_time ASC`,
            [userId, exerciseId, startDate, endDate]
        );
    } catch (error) {
        console.error('Error fetching average weight per session:', error);
        throw error;
    }
};