export const createWorkoutViews = async (db) => {
    await db.execAsync(`
        CREATE VIEW WorkoutFrequency AS
        SELECT 
            user_id,
            DATE(start_time) AS workout_date,
            COUNT(*) AS session_count
        FROM WorkoutSessions
        GROUP BY user_id, DATE(start_time);

        CREATE VIEW FavoriteRoutines AS
        SELECT
            ws.user_id,
            r.id AS routine_id,
            r.title AS routine_title,
            COUNT(*) AS usage_count,
            MAX(ws.start_time) AS last_used
        FROM WorkoutSessions ws
        JOIN Routines r ON ws.routine_id = r.id
        GROUP BY ws.user_id, r.id
        ORDER BY usage_count DESC;
    `);
};

export const createExerciseViews = async (db) => {
    await db.execAsync(`
        CREATE VIEW MuscleGroupFocus AS
        SELECT
            se.session_id,
            mg.name AS muscle_group,
            COUNT(*) * em.intensity AS intensity_score
        FROM SessionExercises se
        JOIN Exercises e ON se.exercise_id = e.id
        JOIN ExerciseMuscles em ON em.exercise_id = e.id
        JOIN Muscles m ON em.muscle_id = m.id
        JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
        GROUP BY se.session_id, mg.name;

        CREATE VIEW StrengthProgress AS
        SELECT
            se.session_id,
            se.exercise_id,
            MAX(ss.weight) AS top_weight,
            SUM(ss.weight * ss.reps) AS total_volume,
            MAX(ss.reps) AS max_reps,
            MAX(ss.estimated_1rm) AS estimated_1rm
        FROM SessionExercises se
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        GROUP BY se.session_id, se.exercise_id;

        CREATE VIEW IF NOT EXISTS ExerciseSessionStats AS
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            MAX(ss.weight) AS heaviest_set,
            MAX(ss.weight * ss.reps) AS top_set,
            SUM(ss.weight * ss.reps) AS total_volume,
            AVG(ss.weight) AS avg_weight,
            MAX(ss.reps) AS most_reps
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        GROUP BY ws.id, se.exercise_id;

        CREATE VIEW IF NOT EXISTS ExerciseStatSets AS
        WITH MaxValues AS (
            SELECT 
                se.id AS session_exercise_id,
                ss.id AS set_id,
                ss.weight,
                ss.reps,
                ss.estimated_1rm,
                MAX(ss.weight) OVER (PARTITION BY se.id) AS max_weight,
                MAX(ss.estimated_1rm) OVER (PARTITION BY se.id) AS max_1rm,
                MAX(ss.reps) OVER (PARTITION BY se.id) AS max_reps
            FROM SessionExercises se
            JOIN SessionSets ss ON se.id = ss.session_exercise_id
        ),
        TieBreakers AS (
            SELECT 
                session_exercise_id,
                set_id,
                weight,
                reps,
                estimated_1rm,
                max_weight,
                max_1rm,
                max_reps,
                MAX(CASE WHEN weight = max_weight THEN reps END) OVER (PARTITION BY session_exercise_id) AS max_reps_at_max_weight,
                MAX(CASE WHEN estimated_1rm = max_1rm THEN weight END) OVER (PARTITION BY session_exercise_id) AS max_weight_at_max_1rm,
                MAX(CASE WHEN reps = max_reps THEN weight END) OVER (PARTITION BY session_exercise_id) AS max_weight_at_max_reps
            FROM MaxValues
        )
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            tb.set_id,
            tb.weight,
            tb.reps,
            CASE 
                WHEN tb.weight = tb.max_weight AND tb.reps = tb.max_reps_at_max_weight
                THEN 1 ELSE 0
            END AS is_heaviest_set,
            CASE 
                WHEN tb.estimated_1rm = tb.max_1rm AND tb.weight = tb.max_weight_at_max_1rm
                THEN 1 ELSE 0
            END AS is_top_set,
            CASE 
                WHEN tb.reps = tb.max_reps AND tb.weight = tb.max_weight_at_max_reps
                THEN 1 ELSE 0
            END AS is_most_reps_set
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        LEFT JOIN TieBreakers tb ON se.id = tb.session_exercise_id;

        CREATE VIEW IF NOT EXISTS ExerciseSessionStatDetails AS
        WITH RankedSets AS (
            SELECT 
                se.id AS session_exercise_id,
                ss.weight,
                ss.reps,
                ss.estimated_1rm,
                ROW_NUMBER() OVER (PARTITION BY se.id ORDER BY ss.weight DESC, ss.reps DESC) AS heaviest_rank,
                ROW_NUMBER() OVER (PARTITION BY se.id ORDER BY ss.estimated_1rm DESC, ss.weight DESC) AS top_rank,
                ROW_NUMBER() OVER (PARTITION BY se.id ORDER BY ss.reps DESC, ss.weight DESC) AS reps_rank
            FROM SessionExercises se
            JOIN SessionSets ss ON se.id = ss.session_exercise_id
        )
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            MAX(CASE WHEN rs.heaviest_rank = 1 THEN rs.weight END) AS heaviest_set_weight,
            MAX(CASE WHEN rs.heaviest_rank = 1 THEN rs.reps END) AS heaviest_set_reps,
            MAX(CASE WHEN rs.top_rank = 1 THEN rs.weight END) AS top_set_weight,
            MAX(CASE WHEN rs.top_rank = 1 THEN rs.reps END) AS top_set_reps,
            MAX(CASE WHEN rs.reps_rank = 1 THEN rs.weight END) AS most_reps_weight,
            MAX(CASE WHEN rs.reps_rank = 1 THEN rs.reps END) AS most_reps_reps,
            SUM(ss.weight * ss.reps) AS total_volume,
            AVG(ss.weight) AS avg_weight
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        LEFT JOIN RankedSets rs ON se.id = rs.session_exercise_id
        GROUP BY ws.id, se.exercise_id;
    `);
};

export const createSorenessViews = async (db) => {
    await db.execAsync(`
        CREATE VIEW IF NOT EXISTS MuscleGroupIntensity AS
        SELECT
            ws.user_id,
            mg.name AS muscle_group,
            SUM(ss.weight * ss.reps * em.intensity * 
                (CASE 
                    WHEN julianday('now') - julianday(ws.start_time) <= 7 THEN 1.0
                    WHEN julianday('now') - julianday(ws.start_time) <= 14 THEN 0.7
                    WHEN julianday('now') - julianday(ws.start_time) <= 28 THEN 0.4
                    ELSE 0.1
                END)
            ) AS intensity_score
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        JOIN Exercises e ON se.exercise_id = e.id
        JOIN ExerciseMuscles em ON em.exercise_id = e.id
        JOIN Muscles m ON em.muscle_id = m.id
        JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
        WHERE ws.start_time >= date('now', '-28 days')
        GROUP BY ws.user_id, mg.name;

        CREATE VIEW IF NOT EXISTS MuscleGroupSoreness AS
        SELECT
            ws.user_id,
            mg.id AS muscle_group_id,
            mg.name AS muscle_group,
            SUM(
                (ss.weight * ss.reps * em.intensity * 
                (ss.weight / COALESCE(emh.max_one_rep_max, 1)) 
                *
                CASE 
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 0.5 THEN 1.0
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1 THEN 0.8
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1.5 THEN 0.65
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2 THEN 0.55
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2.5 THEN 0.45
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 3.5 THEN 0.3
                    ELSE 0.1
                END
                )
            ) AS soreness_score
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        JOIN Exercises e ON se.exercise_id = e.id
        JOIN ExerciseMuscles em ON em.exercise_id = e.id
        JOIN Muscles m ON em.muscle_id = m.id
        JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
        LEFT JOIN (
            SELECT
                user_id,
                exercise_id,
                MAX(one_rep_max) AS max_one_rep_max,
                MAX(calculation_date) AS max_date
            FROM ExerciseMaxHistory
            GROUP BY user_id, exercise_id
        ) emh ON emh.exercise_id = e.id AND emh.user_id = ws.user_id
        WHERE ws.start_time >= date('now', '-7 days')
        GROUP BY ws.user_id, mg.name;

        CREATE VIEW IF NOT EXISTS MuscleSoreness AS
        SELECT
            ws.user_id,
            mg.id AS muscle_group_id,
            mg.name AS muscle_group,
            m.id AS muscle_id,
            m.name AS muscle_name,
            SUM(
                ss.weight * ss.reps * em.intensity * 
                (ss.weight / COALESCE(emh.max_one_rep_max, 1)) 
                *
                CASE 
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 0.5 THEN 1.0
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1 THEN 0.8
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1.5 THEN 0.65
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2 THEN 0.55
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2.5 THEN 0.45
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 3.5 THEN 0.3
                    ELSE 0.1
                END
            ) AS soreness_score
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
        JOIN Exercises e ON se.exercise_id = e.id
        JOIN ExerciseMuscles em ON em.exercise_id = e.id
        JOIN Muscles m ON em.muscle_id = m.id
        JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
        LEFT JOIN (
            SELECT
                user_id,
                exercise_id,
                MAX(one_rep_max) AS max_one_rep_max
            FROM ExerciseMaxHistory
            GROUP BY user_id, exercise_id
        ) emh ON emh.exercise_id = e.id AND emh.user_id = ws.user_id
        WHERE ws.start_time >= date('now', '-7 days')
        GROUP BY ws.user_id, mg.id, m.id;
    `);
};

export const createSplitViews = async (db) => {
    await db.execAsync(`
        CREATE VIEW SplitCycleLengths AS
        SELECT 
            split_id, 
            MAX(split_order) AS cycle_days
        FROM SplitRoutines
        GROUP BY split_id;
    `);
};

export const createViews = async (db) => {
    await createWorkoutViews(db);
    await createExerciseViews(db);
    await createSorenessViews(db);
    await createSplitViews(db);
};