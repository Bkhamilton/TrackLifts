/**
 * Get the number of days in a split cycle.
 * @param {object} db - The database connection.
 * @param {number} splitId - The split ID.
 * @returns {Promise<number>} The number of days in the split cycle.
 */
export const getSplitCycleLength = async (db, splitId) => {
    try {
        const rows = await db.getAllAsync(
            'SELECT cycle_days FROM SplitCycleLengths WHERE split_id = ?',
            [splitId]
        );
        return rows.length > 0 ? rows[0].cycle_days : 0;
    } catch (error) {
        console.error('Error fetching split cycle length:', error);
        throw error;
    }
};