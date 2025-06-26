// Function to add a favorite graph
export const insertFavoriteGraph = async (db, favorite) => {
    try {
        const result = await db.runAsync(
            `INSERT OR IGNORE INTO FavoriteGraphs (user_id, exercise_id, graph_type) VALUES (?, ?, ?)`,
            [favorite.user_id, favorite.exercise_id, favorite.graph_type]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error adding favorite graph:', error);
        throw error;
    }
};

// Function to get all favorite graphs for a user
export const getFavoriteGraphsByUserId = async (db, userId) => {
    try {
        const rows = await db.getAllAsync(
            `SELECT * FROM FavoriteGraphs WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );
        return rows;
    } catch (error) {
        console.error('Error getting favorite graphs by user ID:', error);
        throw error;
    }
};

// Function to get a favorite graph by ID
export const getFavoriteGraphById = async (db, id) => {
    try {
        const rows = await db.getAllAsync(
            `SELECT * FROM FavoriteGraphs WHERE id = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error getting favorite graph by ID:', error);
        throw error;
    }
};

// Function to remove a favorite graph (by user, exercise, and graph type)
export const deleteFavoriteGraph = async (db, userId, exerciseId, graphType) => {
    try {
        await db.runAsync(
            `DELETE FROM FavoriteGraphs WHERE user_id = ? AND exercise_id = ? AND graph_type = ?`,
            [userId, exerciseId, graphType]
        );
        console.log('Favorite graph deleted');
    } catch (error) {
        console.error('Error deleting favorite graph:', error);
        throw error;
    }
};