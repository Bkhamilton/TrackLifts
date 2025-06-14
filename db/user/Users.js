// Function to create a new user
export const insertUser = async (db, user) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO Users (username, name, email, password) VALUES (?, ?, ?, ?)',
            [user.username, user.name, user.email, user.password]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to get a user by ID
export const getUserById = async (db, id) => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM Users WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

// Function to update a user by ID
export const updateUser = async (db, user) => {
    try {
        await db.runAsync(
            'UPDATE Users SET username = ?, name = ?, email = ?, password = ? WHERE id = ?',
            [user.username, user.name, user.email, user.password, user.id]
        );
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const updateUsername = async (db, userId, newUsername) => {
    try {
        await db.runAsync(
            'UPDATE Users SET username = ? WHERE id = ?',
            [newUsername, userId]
        );
    } catch (error) {
        console.error('Error updating username:', error);
        throw error;
    }
}

// Function to delete a user by ID
export const deleteUser = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM Users WHERE id = ?', [userId]);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
