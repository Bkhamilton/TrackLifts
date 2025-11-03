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

export const getWorkoutCountByUser = async (db, userId) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS workoutCount
            FROM 
                WorkoutSessions
            WHERE 
                user_id = ?
        `;
        const result = await db.getAllAsync(query, [userId]);
        return result[0] ? result[0].workoutCount : 0;
    } catch (error) {
        console.error('Error getting workout count by user:', error);
        throw error;
    }
}

export const getYearlyWorkoutCount = async (db, userId) => {
    try {
        const query = `
            SELECT
                strftime('%Y', start_time) AS year,
                COUNT(*) AS count
            FROM
                WorkoutSessions
            WHERE
                user_id = ?
            GROUP BY
                year
            ORDER BY
                year DESC
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return result ? result.count : 0;
    } catch (error) {
        console.error('Error getting yearly workout count:', error);
        throw error;
    }
}

export const getQuarterlyWorkoutCount = async (db, userId) => {
    try {
        const query = `
            SELECT
                COUNT(*) AS count
            FROM
                WorkoutSessions
            WHERE
                user_id = ? AND
                start_time >= datetime('now', '-3 months')
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return result ? result.count : 0;
    } catch (error) {
        console.error('Error getting quarterly workout count:', error);
        throw error;
    }
}

export const getMonthlyWorkoutCount = async (db, userId) => {
    try {
        const query = `
            SELECT 
                strftime('%Y-%m', start_time) AS month,
                COUNT(*) AS count
            FROM 
                WorkoutSessions
            WHERE 
                user_id = ?
            GROUP BY 
                month
            ORDER BY 
                month DESC
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return result ? result.count : 0;
    } catch (error) {
        console.error('Error getting monthly workout count:', error);
        throw error;
    }
}

export const getWeeklyWorkoutCount = async (db, userId) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS count
            FROM 
                WorkoutSessions
            WHERE 
                user_id = ? AND 
                start_time >= datetime('now', '-7 days')
        `;
        const result = await db.getAllAsync(query, [userId]);
        return result[0] ? result[0].count : 0;
    } catch (error) {
        console.error('Error getting weekly workout count:', error);
        throw error;
    }
}

/**
 * Get all workout counts (total, weekly, monthly, quarterly, yearly) in a single query.
 * This is much more efficient than making 5 separate database calls.
 * @param {object} db - The database instance
 * @param {number} userId - The user ID
 * @returns {Promise<object>} Object containing all workout counts
 */
export const getAllWorkoutCounts = async (db, userId) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN start_time >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS weekly,
                SUM(CASE WHEN strftime('%Y-%m', start_time) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) AS monthly,
                SUM(CASE WHEN start_time >= datetime('now', '-3 months') THEN 1 ELSE 0 END) AS quarterly,
                SUM(CASE WHEN strftime('%Y', start_time) = strftime('%Y', 'now') THEN 1 ELSE 0 END) AS yearly
            FROM 
                WorkoutSessions
            WHERE 
                user_id = ?
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return {
            total: result?.total || 0,
            weekly: result?.weekly || 0,
            monthly: result?.monthly || 0,
            quarterly: result?.quarterly || 0,
            yearly: result?.yearly || 0,
        };
    } catch (error) {
        console.error('Error getting all workout counts:', error);
        throw error;
    }
};

export const getTotalCaloriesBurned = async (db, userId) => {
    try {
        const query = `
            SELECT 
                SUM(calories_burned) AS totalCalories
            FROM 
                WorkoutSessions
            WHERE 
                user_id = ?
        `;
        const result = await db.getFirstAsync(query, [userId]);
        return result ? result.totalCalories : 0;
    } catch (error) {
        console.error('Error getting total calories burned:', error);
        throw error;
    }
}

export const getWeeklyAverageDuration = async (db, userId) => {
    try {
        // 1. Get all end_time values for this user's workouts in the last 7 days
        const query = `
            SELECT end_time
            FROM WorkoutSessions
            WHERE user_id = ? 
              AND start_time >= datetime('now', '-7 days')
              AND end_time IS NOT NULL
        `;
        const rows = await db.getAllAsync(query, [userId]);
        if (!rows || rows.length === 0) return "00:00:00";

        // 2. Parse durations to seconds
        const toSeconds = (str) => {
            if (!str) return 0;
            const parts = str.split(':').map(Number).reverse();
            let [ss = 0, mm = 0, hh = 0, dd = 0] = [0, 0, 0, 0];
            if (parts.length === 3) {
                [ss, mm, hh] = parts;
            } else if (parts.length === 4) {
                [ss, mm, hh, dd] = parts;
            }
            return dd * 86400 + hh * 3600 + mm * 60 + ss;
        };

        const totalSeconds = rows.reduce((sum, row) => sum + toSeconds(row.end_time), 0);
        const avgSeconds = Math.round(totalSeconds / rows.length);

        // 3. Format back to DD:HH:MM:SS or HH:MM:SS
        const formatDuration = (secs) => {
            const dd = Math.floor(secs / 86400);
            const hh = Math.floor((secs % 86400) / 3600);
            const mm = Math.floor((secs % 3600) / 60);
            const ss = secs % 60;
            if (dd > 0) {
                return `${dd.toString().padStart(2, '0')}:${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
            } else {
                return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
            }
        };

        return formatDuration(avgSeconds);
    } catch (error) {
        console.error('Error getting weekly average duration:', error);
        throw error;
    }
};

export const insertWorkoutSession = async (db, session) => {
    try {
        const result = await db.runAsync(
            `INSERT INTO WorkoutSessions (user_id, routine_id, start_time, end_time, notes, calories_burned) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [session.userId, session.routineId, session.startTime, session.endTime, session.notes, session.caloriesBurned]
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
