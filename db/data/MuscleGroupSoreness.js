// app/db/data/MuscleSoreness.js
export const getMuscleGroupSoreness = async (db, userId) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_group, muscle_group_id, soreness_score FROM MuscleGroupSoreness WHERE user_id = ?',
            [userId]
        );
    } catch (error) {
        console.error('Error fetching muscle group soreness:', error);
        throw error;
    }
};

export const updateMuscleSoreness = async (db, userId) => {
    try {
        // Calculate current soreness for muscle groups
        const currentSoreness = await db.getAllAsync(`
            SELECT muscle_group_id, soreness_score 
            FROM MuscleGroupSoreness
            WHERE user_id = ?
        `, [userId]);
        
        if (currentSoreness.length === 0) {
            return true;
        }
        
        // Batch update max soreness levels for muscle groups using a single query
        await db.runAsync(`
            INSERT OR REPLACE INTO UserMuscleMaxSoreness (user_id, muscle_group_id, max_soreness)
            SELECT 
                ? as user_id,
                mgs.muscle_group_id,
                MAX(mgs.soreness_score, COALESCE(umms.max_soreness, 0)) as max_soreness
            FROM MuscleGroupSoreness mgs
            LEFT JOIN UserMuscleMaxSoreness umms 
                ON umms.user_id = ? AND umms.muscle_group_id = mgs.muscle_group_id
            WHERE mgs.user_id = ?
        `, [userId, userId, userId]);
        
        // Calculate current soreness for individual muscles
        const currentIndividualSoreness = await db.getAllAsync(`
            SELECT muscle_id, soreness_score 
            FROM MuscleSoreness
            WHERE user_id = ?
        `, [userId]);
        
        if (currentIndividualSoreness.length > 0) {
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
        }
        
        // Batch insert soreness history for all muscle groups at once
        if (currentSoreness.length > 0) {
            // Use parameterized queries to prevent SQL injection
            const placeholders = currentSoreness.map(() => '(?, ?, ?)').join(',');
            const values = currentSoreness.flatMap(s => [userId, s.muscle_group_id, s.soreness_score]);
            await db.runAsync(`
                INSERT INTO MuscleSorenessHistory (user_id, muscle_group_id, soreness_score)
                VALUES ${placeholders}
            `, values);
        }
        
        return true;
    } catch (error) {
        console.error('Error updating muscle soreness:', error);
        return false;
    }
};