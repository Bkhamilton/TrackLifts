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
        
        // Update max soreness levels for individual muscles
        for (const { muscle_id, soreness_score } of currentSoreness) {
            // Get current max_soreness
            const row = await db.getFirstAsync(
                `SELECT max_soreness FROM UserIndividualMuscleMaxSoreness WHERE user_id = ? AND muscle_id = ?`,
                [userId, muscle_id]
            );
            const currentMax = row?.max_soreness ?? 0;
            if (soreness_score > currentMax) {
                await db.runAsync(
                    `INSERT OR REPLACE INTO UserIndividualMuscleMaxSoreness (user_id, muscle_id, max_soreness, last_updated) 
                     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
                    [userId, muscle_id, soreness_score]
                );
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error updating individual muscle soreness:', error);
        return false;
    }
};