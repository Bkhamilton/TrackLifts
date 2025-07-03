// app/db/data/MuscleSoreness.js
export const updateMuscleSoreness = async (db, userId) => {
    try {
        // Calculate current soreness
        const currentSoreness = await db.getAllAsync(`
            SELECT muscle_group_id, intensity_score 
            FROM MuscleGroupSoreness
            WHERE user_id = ?
        `, [userId]);
        
        // Update max soreness levels
        for (const { muscle_group_id, intensity_score } of currentSoreness) {
            await db.runAsync(`
                INSERT OR REPLACE INTO UserMuscleMaxSoreness (
                    user_id, muscle_group_id, max_soreness
                ) VALUES (
                    ?,
                    ?,
                    COALESCE((
                        SELECT MAX(max_soreness) 
                        FROM UserMuscleMaxSoreness 
                        WHERE user_id = ? 
                        AND muscle_group_id = ?
                    ), 0)
                )
                WHERE ? > COALESCE((
                    SELECT max_soreness 
                    FROM UserMuscleMaxSoreness 
                    WHERE user_id = ? 
                    AND muscle_group_id = ?
                ), 0)
            `, [
                userId, muscle_group_id,
                userId, muscle_group_id,
                intensity_score,
                userId, muscle_group_id
            ]);
        }
        
        // Store soreness history
        for (const { muscle_group_id, intensity_score } of currentSoreness) {
            await db.runAsync(`
                INSERT INTO MuscleSorenessHistory (
                    user_id, muscle_group_id, soreness_score
                ) VALUES (?, ?, ?)
            `, [userId, muscle_group_id, intensity_score]);
        }
        
        return true;
    } catch (error) {
        console.error('Error updating muscle soreness:', error);
        return false;
    }
};