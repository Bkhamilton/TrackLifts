export const getTotalWorkoutSessions = async (db) => {
    try {
        const query = `
            SELECT 
                ws.*, 
                u.name AS userName, 
                r.name AS routineName
            FROM 
                WorkoutSessions ws
            LEFT JOIN 
                Users u 
            ON 
                ws.user_id = u.id
            LEFT JOIN 
                Routines r 
            ON 
                ws.routine_id = r.id
            `;
        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting workout sessions:', error);
        throw error;
    }
};

export const getWorkoutSessions = async (db, userId) => {
    try {
        const query = `
            SELECT 
                ws.id,
                ws.routine_id AS routineId,
                ws.start_time AS startTime,
                ws.end_time AS endTime,
                ws.notes, 
                r.title AS routineTitle
            FROM 
                WorkoutSessions ws
            LEFT JOIN 
                Routines r 
            ON 
                ws.routine_id = r.id
            WHERE 
                ws.user_id = ?
            ORDER BY 
                ws.start_time DESC
        `;
        const allRows = await db.getAllAsync(query, [userId]);
        return allRows;
    } catch (error) {
        console.error('Error getting workout sessions:', error);
        throw error;
    }
}   

export const insertWorkoutSession = async (db, session) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO WorkoutSessions (user_id, routine_id, start_time, end_time, notes) 
             VALUES (?, ?, ?, ?, ?)`,
            [session.userId, session.routineId, session.startTime, session.endTime, session.notes]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting workout session:', error);
        throw error;
    }
};

export const updateWorkoutSession = async (db, session) => {
    try {
        await db.runAsync(
            `UPDATE WorkoutSessions 
             SET user_id = ?, routine_id = ?, start_time = ?, end_time = ?, notes = ? 
             WHERE id = ?`,
            [session.userId, session.routineId, session.startTime, session.endTime, session.notes, session.id]
        );
        console.log('Workout session updated');
    } catch (error) {
        console.error('Error updating workout session:', error);
        throw error;
    }
};

export const deleteWorkoutSession = async (db, sessionId) => {
    try {
        await db.runAsync('DELETE FROM WorkoutSessions WHERE id = ?', [sessionId]);
    } catch (error) {
        console.error('Error deleting workout session:', error);
        throw error;
    }
};
