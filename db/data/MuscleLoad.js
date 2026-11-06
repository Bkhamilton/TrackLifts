import { withWorkoutDataLock } from '../../utils/workoutDataLock.js';
import { calculateMuscleLoad } from '../../utils/muscleLoadModel.js';
/** @param {number|undefined} [now] */
export async function getMuscleLoadSnapshot(db, userId, ratios, now = undefined) {
    return withWorkoutDataLock(db, async () => {
        const [muscles, mappings, sets] = await Promise.all([
            db.getAllAsync(`SELECT m.id AS muscle_id, m.name AS muscle_name,
                mg.id AS muscle_group_id, mg.name AS muscle_group
                FROM Muscles m JOIN MuscleGroups mg ON mg.id = m.muscle_group_id`),
            db.getAllAsync('SELECT exercise_id, muscle_id, intensity FROM ExerciseMuscles'),
            db.getAllAsync(`SELECT ss.*, ss.id AS set_id, se.id AS session_exercise_id,
                se.exercise_id, ws.id AS session_id, ws.start_time, ws.end_time,
                e.title AS exercise_name, eq.name AS equipment, r.title AS routine_title
                FROM SessionSets ss JOIN SessionExercises se ON se.id = ss.session_exercise_id
                JOIN WorkoutSessions ws ON ws.id = se.session_id
                LEFT JOIN Exercises e ON e.id = se.exercise_id
                LEFT JOIN Equipment eq ON eq.id = e.equipment_id
                LEFT JOIN Routines r ON r.id = ws.routine_id WHERE ws.user_id = ?`, [userId]),
        ]);
        return calculateMuscleLoad({ muscles, mappings, sets, ratios, now: now ?? Date.now() });
    });
}
