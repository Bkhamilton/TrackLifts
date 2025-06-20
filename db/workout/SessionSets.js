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

export const insertSessionSet = async (db, sessionSet) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO SessionSets (session_exercise_id, set_order, weight, reps, completed, rest_time, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sessionSet.sessionExerciseId,
                sessionSet.setOrder,
                sessionSet.weight,
                sessionSet.reps,
                sessionSet.completed,
                sessionSet.restTime,
                sessionSet.notes
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
             SET session_exercise_id = ?, set_order = ?, weight = ?, reps = ?, completed = ?, rest_time = ?, notes = ? 
             WHERE id = ?`,
            [
                sessionSet.sessionExerciseId,
                sessionSet.setOrder,
                sessionSet.weight,
                sessionSet.reps,
                sessionSet.completed,
                sessionSet.restTime,
                sessionSet.notes,
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
