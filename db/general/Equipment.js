// CRUD functions for Equipment table

export const getEquipment = async (db) => {
    try {
        const query = `
            SELECT id, name
            FROM Equipment
            ORDER BY name
        `;
        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting equipment:', error);
        throw error;
    }
};

export const insertEquipment = async (db, name) => {
    try {
        const result = await db.runAsync(
            'INSERT INTO Equipment (name) VALUES (?)',
            [name]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting equipment:', error);
        throw error;
    }
};

export const updateEquipment = async (db, id, name) => {
    try {
        await db.runAsync(
            'UPDATE Equipment SET name = ? WHERE id = ?',
            [name, id]
        );
        console.log('Equipment updated');
    } catch (error) {
        console.error('Error updating equipment:', error);
        throw error;
    }
};

export const deleteEquipment = async (db, id) => {
    try {
        await db.runAsync('DELETE FROM Equipment WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting equipment:', error);
        throw error;
    }
};
