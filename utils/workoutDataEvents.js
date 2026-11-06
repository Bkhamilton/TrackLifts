const listeners = new Set();
export function subscribeWorkoutChanges(listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
export function notifyWorkoutChanged() {
    for (const listener of listeners) listener();
}
