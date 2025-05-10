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
        console.log('User updated');
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Function to delete a user by ID
export const deleteUser = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM Users WHERE id = ?', [userId]);
        console.log('User deleted');
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
