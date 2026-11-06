import { effectiveResistance, timestamp } from '../../utils/muscleLoadModel.js';
import { insertSessionExercise } from './SessionExercises.js';
import { insertSessionSet } from './SessionSets.js';

export function validateWorkoutTimes(startTime, endTime, allowLegacyEnd = false) {
    const start = timestamp(startTime), end = timestamp(endTime);
    if (!Number.isFinite(start) || start > Date.now()) throw new Error('Enter a valid workout start time that is not in the future.');
    if (!Number.isFinite(end) && allowLegacyEnd) return;
    if (!Number.isFinite(end) || end < start || end > Date.now()) throw new Error('Enter a valid finish time after the start and not in the future.');
}
/** @param {number|null} bodyMass */
export async function insertRecordedExercises(db, sessionId, exercises, bodyMass = null, editing = false) {
    for (const exercise of exercises) {
        const sets = exercise.sets.filter(s => editing ? s.completed !== false && s.completed !== 0 : s.completed === true || s.completed === 1);
        if (!sets.length) continue;
        const sessionExerciseId = await insertSessionExercise(db, { sessionId, exerciseId: exercise.exercise_id ?? exercise.id });
        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            if (!Number.isFinite(set.weight) || set.weight < 0 || !Number.isFinite(set.reps) || set.reps <= 0) {
                throw new Error('Completed sets need non-negative weight and positive repetitions.');
            }
            // Never apply today's body mass to an edited historical workout.
            const bodyMassLbs = editing ? set.body_mass_lbs ?? null : bodyMass;
            const resistance = effectiveResistance(set.weight, exercise.equipment, bodyMassLbs);
            const isHold = ['Plank', 'Side Plank', 'Hollow Body Hold', 'Wall Sit'].includes(exercise.title);
            const estimated1RM = !isHold && resistance !== null && resistance > 0 && set.reps <= 12
                ? (set.reps === 1 ? resistance : resistance * (1 + set.reps / 30)) : null;
            await insertSessionSet(db, {
                sessionExerciseId, setOrder: i + 1, weight: set.weight, reps: set.reps,
                estimated1RM, restTime: set.restTime ?? set.rest_time ?? null, completed: true,
                completionSource: editing ? set.completion_source ?? 'legacy-unknown' : 'confirmed', bodyMassLbs,
            });
        }
    }
}
/** Rebuild records from surviving sets, inside the caller's write transaction. */
export async function rebuildExerciseRecords(db, userId) {
    await db.runAsync('DELETE FROM ExerciseMaxHistory WHERE user_id = ?', [userId]);
    await db.runAsync(`INSERT INTO ExerciseMaxHistory (user_id, exercise_id, one_rep_max, calculation_date)
        SELECT ws.user_id, se.exercise_id, MAX(ss.estimated_1rm), ws.start_time
        FROM WorkoutSessions ws JOIN SessionExercises se ON se.session_id = ws.id
        JOIN SessionSets ss ON ss.session_exercise_id = se.id
        WHERE ws.user_id = ? AND ss.completed = 1 AND ss.estimated_1rm > 0
            AND julianday(ws.start_time) <= julianday('now')
        GROUP BY ws.id, se.exercise_id`, [userId]);
}
