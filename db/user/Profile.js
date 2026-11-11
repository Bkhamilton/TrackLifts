import { withWorkoutDataLock } from '../../utils/workoutDataLock.js';
import { getUserProfileStats } from './UserProfileStats.js';
import { getUserById } from './Users.js';

const statFields = ['height', 'weight', 'bodyFat', 'favoriteExercise', 'memberSince', 'goals'];

// Only explicitly edited fields may be written; provider snapshots are not writes.
export async function saveProfileChanges(db, userId, changes) {
    const fields = Object.keys(changes.stats ?? {});
    if (fields.some(field => !statFields.includes(field) || typeof changes.stats[field] !== 'string')
        || (changes.username !== undefined && typeof changes.username !== 'string')) {
        throw new Error('Invalid profile changes.');
    }
    return withWorkoutDataLock(db, async () => {
        await db.runAsync('BEGIN IMMEDIATE');
        try {
            if (changes.username !== undefined) {
                const result = await db.runAsync('UPDATE Users SET username = ? WHERE id = ?', [changes.username, userId]);
                if (result.changes !== 1) throw new Error('User profile is unavailable.');
            }
            if (fields.length) {
                const result = await db.runAsync(
                    `UPDATE UserProfileStats SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE user_id = ?`,
                    [...fields.map(field => changes.stats[field]), userId]
                );
                if (result.changes !== 1) throw new Error('Profile statistics are unavailable.');
            }
            const user = await getUserById(db, userId);
            const stats = await getUserProfileStats(db, userId);
            if (!user || !stats) throw new Error('User profile is unavailable.');
            await db.runAsync('COMMIT');
            return { user, stats };
        } catch (error) {
            try { await db.runAsync('ROLLBACK'); } catch { /* Preserve the original failure. */ }
            throw error;
        }
    });
}
