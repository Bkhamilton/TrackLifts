export const getMuscleMaxSoreness = async (db, userId) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_group_id, max_soreness FROM UserMuscleMaxSoreness WHERE user_id = ?',
            [userId]
        );
    } catch (error) {
        console.error('Error fetching max muscle soreness:', error);
        return [];
    }
};