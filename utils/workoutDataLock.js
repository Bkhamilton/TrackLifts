// Serialize the canonical read with workout writes on the same connection, so a
// timer/focus refresh cannot observe half of a multi-statement transaction.
const pending = new WeakMap();
export function withWorkoutDataLock(db, operation) {
    if (!db) return Promise.reject(new Error('Workout database is not ready.'));
    const previous = pending.get(db) ?? Promise.resolve();
    const result = previous.catch(() => {}).then(operation);
    const settled = result.then(() => {}, () => {});
    pending.set(db, settled);
    return result;
}
