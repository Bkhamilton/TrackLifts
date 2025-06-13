export const insertUserProfileStats = async (db, userId, stats) => {
    await db.runAsync(
        `INSERT INTO UserProfileStats 
        (user_id, height, weight, bodyFat, workoutsCompleted, weeklyWorkouts, weeklySets, favoriteExercise, memberSince, goals)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            stats.height,
            stats.weight,
            stats.bodyFat,
            stats.workoutsCompleted,
            stats.weeklyWorkouts,
            stats.weeklySets,
            stats.favoriteExercise,
            stats.memberSince,
            stats.goals,
        ]
    );
};

export const updateUserProfileStats = async (db, userId, stats) => {
    await db.runAsync(
        `UPDATE UserProfileStats SET
            height = ?, weight = ?, bodyFat = ?, workoutsCompleted = ?, weeklyWorkouts = ?, weeklySets = ?, favoriteExercise = ?, memberSince = ?, goals = ?
        WHERE user_id = ?`,
        [
            stats.height,
            stats.weight,
            stats.bodyFat,
            stats.workoutsCompleted,
            stats.weeklyWorkouts,
            stats.weeklySets,
            stats.favoriteExercise,
            stats.memberSince,
            stats.goals,
            userId,
        ]
    );
};

export const getUserProfileStats = async (db, userId) => {
    const result = await db.getAsync(
        `SELECT * FROM UserProfileStats WHERE user_id = ?`,
        [userId]
    );
    return result;
};