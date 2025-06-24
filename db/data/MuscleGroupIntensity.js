export const getMuscleGroupIntensity = async (db, userId) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_group, intensity_score FROM MuscleGroupIntensity WHERE user_id = ?',
            [userId]
        );
    } catch (error) {
        console.error('Error fetching muscle group intensity:', error);
        throw error;
    }
};