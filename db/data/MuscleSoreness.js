export const getMuscleSorenessByMuscleGroup = async (db, userId, muscleGroupId) => {
    if (!db || !userId) return [];
    try {
        return await db.getAllAsync(
            `SELECT muscle_id, muscle_name, soreness_score 
             FROM MuscleSoreness 
             WHERE user_id = ? AND muscle_group_id = ?`,
            [userId, muscleGroupId]
        );
    } catch (e) {
        console.error('Failed to fetch muscle soreness:', e);
        return [];
    }
};

export const updateIndividualMuscleSoreness = async (db, userId) => {
    try {
        // Calculate current individual muscle soreness
        const currentSoreness = await db.getAllAsync(`
            SELECT muscle_id, soreness_score 
            FROM MuscleSoreness
            WHERE user_id = ?
        `, [userId]);
        
        if (currentSoreness.length === 0) {
            return true;
        }
        
        // Batch update max soreness levels for individual muscles using a single query
        await db.runAsync(`
            INSERT OR REPLACE INTO UserIndividualMuscleMaxSoreness (user_id, muscle_id, max_soreness, last_updated)
            SELECT 
                ? as user_id,
                ms.muscle_id,
                MAX(ms.soreness_score, COALESCE(uimms.max_soreness, 0)) as max_soreness,
                CURRENT_TIMESTAMP as last_updated
            FROM MuscleSoreness ms
            LEFT JOIN UserIndividualMuscleMaxSoreness uimms 
                ON uimms.user_id = ? AND uimms.muscle_id = ms.muscle_id
            WHERE ms.user_id = ?
        `, [userId, userId, userId]);
        
        return true;
    } catch (error) {
        console.error('Error updating individual muscle soreness:', error);
        return false;
    }
};