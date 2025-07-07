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