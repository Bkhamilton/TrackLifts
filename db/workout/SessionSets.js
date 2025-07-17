export const getSessionSets = async (db) => {
    try {
        const query = `
            SELECT 
                ss.*, 
                se.name AS sessionExerciseName
            FROM 
                SessionSets ss
            LEFT JOIN 
                SessionExercises se 
            ON 
                ss.session_exercise_id = se.id
            `;
        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting session sets:', error);
        throw error;
    }
};

export const getSessionExerciseDetails = async (db, sessionExerciseId) => {
    try {
        const query = `
            SELECT 
                ss.*
            FROM 
                SessionSets ss
            WHERE 
                ss.session_exercise_id = ?
            ORDER BY 
                ss.set_order ASC
        `;
        const allRows = await db.getAllAsync(query, [sessionExerciseId]);
        return allRows;
    } catch (error) {
        console.error('Error getting session exercise details:', error);
        throw error;
    }
}

export const getWeeklySetCount = async (db, userId) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS weeklySetCount
            FROM 
                SessionSets ss
            LEFT JOIN 
                SessionExercises se ON ss.session_exercise_id = se.id
            JOIN 
                WorkoutSessions ws ON se.session_id = ws.id
            WHERE 
                ws.user_id = ? AND 
                ws.start_time >= datetime('now', '-7 days')
        `;
        const result = await db.getAllAsync(query, [userId]);
        return result[0] ? result[0].weeklySetCount : 0;
    } catch (error) {
        console.error('Error getting weekly set count:', error);
        throw error;
    }
}

// Get the maximum estimated 1RM for a specific exercise from startOffset to endOffset
export const getMax1RM = async (db, userId, exerciseId, startOffset, endOffset) => {
    try {
        const query = `
            SELECT MAX(ss.estimated_1rm) AS max_1rm
            FROM SessionSets ss
            JOIN SessionExercises se ON ss.session_exercise_id = se.id
            JOIN WorkoutSessions ws ON se.session_id = ws.id
            WHERE ws.user_id = ?
              AND se.exercise_id = ?
              AND DATE(ws.start_time) >= DATE('now', ?)
              AND DATE(ws.start_time) < DATE('now', ?)
        `;
        // startOffset: e.g. '-7 days', endOffset: '0 days' for this week
        const result = await db.getFirstAsync(query, [userId, exerciseId, startOffset, endOffset]);
        return result?.max_1rm || 0;
    } catch (error) {
        console.error('Error getting max 1RM:', error);
        throw error;
    }
};

// Get the total weight lifted in the last 7 days for a specific user
export const getWeeklyWeightLifted = async (db, userId) => {
    try {
        const query = `
            SELECT 
                SUM(ss.weight * ss.reps) AS totalWeightLifted
            FROM SessionSets ss
            JOIN SessionExercises se ON ss.session_exercise_id = se.id
            JOIN WorkoutSessions ws ON se.session_id = ws.id
            WHERE 
                ws.user_id = ? AND 
                ws.start_time >= datetime('now', '-7 days')
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return result?.totalWeightLifted || 0;
    } catch (error) {
        console.error('Error getting weekly weight lifted:', error);
        throw error;
    }
}

export const insertSessionSet = async (db, sessionSet) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO SessionSets (session_exercise_id, set_order, weight, reps, estimated_1rm, completed, rest_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sessionSet.sessionExerciseId,
                sessionSet.setOrder,
                sessionSet.weight,
                sessionSet.reps,
                sessionSet.estimated1RM,
                sessionSet.completed,
                sessionSet.restTime
            ]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting session set:', error);
        throw error;
    }
};

export const updateSessionSet = async (db, sessionSet) => {
    try {
        await db.runAsync(
            `UPDATE SessionSets 
             SET session_exercise_id = ?, set_order = ?, weight = ?, reps = ?, completed = ?, rest_time = ? 
             WHERE id = ?`,
            [
                sessionSet.sessionExerciseId,
                sessionSet.setOrder,
                sessionSet.weight,
                sessionSet.reps,
                sessionSet.completed,
                sessionSet.restTime,
                sessionSet.id
            ]
        );
        console.log('Session set updated');
    } catch (error) {
        console.error('Error updating session set:', error);
        throw error;
    }
};

export const deleteSessionSet = async (db, sessionSetId) => {
    try {
        await db.runAsync('DELETE FROM SessionSets WHERE id = ?', [sessionSetId]);
    } catch (error) {
        console.error('Error deleting session set:', error);
        throw error;
    }
};

export const clearSessionSets = async (db, sessionExerciseId) => {
    try {
        await db.runAsync('DELETE FROM SessionSets WHERE session_exercise_id = ?', [sessionExerciseId]);
    } catch (error) {
        console.error('Error clearing session sets:', error);
        throw error;
    }
};

export const clearSessionSetsByWorkout = async (db, workoutSessionId) => {
    try {
        await db.runAsync(
            `DELETE FROM SessionSets 
             WHERE session_exercise_id IN (
                 SELECT id FROM SessionExercises WHERE session_id = ?
             )`, 
            [workoutSessionId]
        );
    } catch (error) {
        console.error('Error clearing session sets by workout session ID:', error);
        throw error;
    }
}