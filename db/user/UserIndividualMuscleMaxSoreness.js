// db/user/UserIndividualMuscleMaxSoreness.js
export const getIndividualMuscleMaxSoreness = async (db, userId, muscleId) => {
    try {
        const result = await db.getFirstAsync(
            'SELECT max_soreness FROM UserIndividualMuscleMaxSoreness WHERE user_id = ? AND muscle_id = ?',
            [userId, muscleId]
        );
        return result?.max_soreness || 0;
    } catch (error) {
        console.error('Error fetching individual muscle max soreness:', error);
        return 0;
    }
};

export const getAllIndividualMuscleMaxSoreness = async (db, userId) => {
    try {
        return await db.getAllAsync(
            'SELECT muscle_id, max_soreness FROM UserIndividualMuscleMaxSoreness WHERE user_id = ?',
            [userId]
        );
    } catch (error) {
        console.error('Error fetching all individual muscle max soreness:', error);
        return [];
    }
};

export const updateIndividualMuscleMaxSoreness = async (db, userId, muscleId, maxSoreness) => {
    try {
        await db.runAsync(
            `INSERT OR REPLACE INTO UserIndividualMuscleMaxSoreness (user_id, muscle_id, max_soreness, last_updated) 
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [userId, muscleId, maxSoreness]
        );
        return true;
    } catch (error) {
        console.error('Error updating individual muscle max soreness:', error);
        return false;
    }
};
