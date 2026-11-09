/** Idempotent, additive migration. Historical completion remains unknown. */
export async function migrateRecordedLoad(db) {
    await db.runAsync('BEGIN TRANSACTION');
    try {
        const names = new Set((await db.getAllAsync('PRAGMA table_info(SessionSets)')).map(c => c.name));
        for (const [name, definition] of [
            ['completion_source', "TEXT NOT NULL DEFAULT 'legacy-unknown'"],
            ['body_mass_lbs', 'REAL'],
            ['rir', 'REAL'],
            ['is_warmup', 'INTEGER'],
            ['duration_seconds', 'REAL'],
        ]) {
            if (!names.has(name)) await db.execAsync(`ALTER TABLE SessionSets ADD COLUMN ${name} ${definition}`);
        }
        // Legacy maxima/history retained for rollback, never read by the new model.
        await db.runAsync('COMMIT');
    } catch (error) { await db.runAsync('ROLLBACK'); throw error; }
}
