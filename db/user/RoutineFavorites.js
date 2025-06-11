export const addFavoriteRoutine = async (db, userId, routineId) => {
    await db.runAsync(
        `INSERT OR IGNORE INTO RoutineFavorites (user_id, routine_id) VALUES (?, ?)`,
        [userId, routineId]
    );
};

export const removeFavoriteRoutine = async (db, userId, routineId) => {
    await db.runAsync(
        `DELETE FROM RoutineFavorites WHERE user_id = ? AND routine_id = ?`,
        [userId, routineId]
    );
};

export const getFavoriteRoutineIds = async (db, userId) => {
    const results = await db.getAllAsync(
        `SELECT routine_id FROM RoutineFavorites WHERE user_id = ?`,
        [userId]
    );
    return results.map(row => row.routine_id);
};