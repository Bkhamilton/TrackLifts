import { syncTables } from '@/api/sync';
import userData from '@/data/UserData.json';
import { insertUserProfileStats } from '@/db/user/UserProfileStats';
import { insertUser } from '@/db/user/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createTables = async (db) => {
    // Your table creation logic here
    await createGeneralTables(db);
    await createUserTables(db);
    await createWorkoutTables(db);
    await createIndexes(db);
    await createDataViews(db);
};

export const createGeneralTables = async (db) => {
    // Your general table creation logic here
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MuscleGroups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS Muscles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            muscle_group_id INTEGER,
            FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
        );
        CREATE TABLE IF NOT EXISTS Equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS Exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            equipment_id INTEGER,
            muscle_group_id INTEGER,
            FOREIGN KEY (equipment_id) REFERENCES Equipment(id),
            FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
        );
        CREATE TABLE IF NOT EXISTS ExerciseMuscles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_id INTEGER,
            muscle_id INTEGER,
            intensity REAL NOT NULL,
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );
    `);
}

export const createUserTables = async (db) => {
    // Your user-specific table creation logic here
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS UserProfileStats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            height TEXT,
            weight TEXT,
            bodyFat TEXT,
            favoriteExercise TEXT,
            memberSince TEXT,
            goals TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            UNIQUE(user_id)
        );
        CREATE TABLE IF NOT EXISTS Routines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        );
        CREATE TABLE IF NOT EXISTS RoutineFavorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            routine_id INTEGER,
            UNIQUE(user_id, routine_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (routine_id) REFERENCES Routines(id)
        );
        CREATE TABLE IF NOT EXISTS RoutineExercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            routine_id INTEGER,
            exercise_id INTEGER,
            FOREIGN KEY (routine_id) REFERENCES Routines(id),
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
        );
        CREATE TABLE IF NOT EXISTS ExerciseSets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            routine_exercise_id INTEGER,
            set_order INTEGER NOT NULL,
            weight REAL NOT NULL,
            reps INTEGER NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (routine_exercise_id) REFERENCES RoutineExercises(id)
        );
        CREATE TABLE IF NOT EXISTS Splits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            user_id INTEGER,
            is_active INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        );
        CREATE TABLE IF NOT EXISTS SplitRoutines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            split_id INTEGER,
            split_order INTEGER NOT NULL,
            routine_id INTEGER,
            FOREIGN KEY (split_id) REFERENCES Splits(id),
            FOREIGN KEY (routine_id) REFERENCES Routines(id)
        );
        CREATE TABLE IF NOT EXISTS SplitCompletions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            split_id INTEGER NOT NULL,
            completion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_cycles INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (split_id) REFERENCES Splits(id)
        );
        CREATE TABLE IF NOT EXISTS MuscleSorenessHistory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            muscle_group_id INTEGER NOT NULL,
            soreness_score REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
        );
        CREATE TABLE IF NOT EXISTS UserMuscleMaxSoreness (
            user_id INTEGER NOT NULL,
            muscle_group_id INTEGER NOT NULL,
            max_soreness REAL NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, muscle_group_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
        );
        CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness (
            user_id INTEGER NOT NULL,
            muscle_id INTEGER NOT NULL,
            max_soreness REAL NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, muscle_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );        
    `);
}

export const createWorkoutTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS WorkoutSessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            routine_id INTEGER,
            start_time DATETIME NOT NULL,
            end_time STRING,
            notes TEXT,
            calories_burned REAL,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (routine_id) REFERENCES Routines(id)
        );
        CREATE TABLE IF NOT EXISTS SessionExercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            exercise_id INTEGER,
            FOREIGN KEY (session_id) REFERENCES WorkoutSessions(id),
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
        );
        CREATE TABLE IF NOT EXISTS SessionSets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_exercise_id INTEGER,
            set_order INTEGER NOT NULL,
            weight REAL NOT NULL,
            reps INTEGER NOT NULL,
            estimated_1rm REAL,
            completed BOOLEAN DEFAULT 1,
            rest_time INTEGER,
            FOREIGN KEY (session_exercise_id) REFERENCES SessionExercises(id)
        );
        CREATE TABLE IF NOT EXISTS ExerciseMaxHistory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            one_rep_max REAL NOT NULL,
            calculation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
        );
        CREATE TABLE IF NOT EXISTS FavoriteGraphs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            graph_type TEXT NOT NULL, -- e.g. 'top_set', 'heaviest_set', etc.
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, exercise_id, graph_type),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
        );
    `);
}

export const createIndexes = async (db) => {
    await db.execAsync(`
        -- Indexes for foreign key relationships
        CREATE INDEX IF NOT EXISTS idx_muscles_muscle_group_id ON Muscles(muscle_group_id);
        CREATE INDEX IF NOT EXISTS idx_exercises_equipment_id ON Exercises(equipment_id);
        CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group_id ON Exercises(muscle_group_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_muscles_exercise_id ON ExerciseMuscles(exercise_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_muscles_muscle_id ON ExerciseMuscles(muscle_id);
        
        -- Indexes for user relationships
        CREATE INDEX IF NOT EXISTS idx_routines_user_id ON Routines(user_id);
        CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_id ON RoutineExercises(routine_id);
        CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise_id ON RoutineExercises(exercise_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_sets_routine_exercise_id ON ExerciseSets(routine_exercise_id);
        CREATE INDEX IF NOT EXISTS idx_splits_user_id ON Splits(user_id);
        CREATE INDEX IF NOT EXISTS idx_split_routines_split_id ON SplitRoutines(split_id);
        CREATE INDEX IF NOT EXISTS idx_split_routines_routine_id ON SplitRoutines(routine_id);
        CREATE INDEX IF NOT EXISTS idx_split_completions_user_id ON SplitCompletions(user_id);
        CREATE INDEX IF NOT EXISTS idx_split_completions_split_id ON SplitCompletions(split_id);
        
        -- Indexes for workout session relationships
        CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON WorkoutSessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_workout_sessions_routine_id ON WorkoutSessions(routine_id);
        CREATE INDEX IF NOT EXISTS idx_workout_sessions_start_time ON WorkoutSessions(start_time);
        CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON SessionExercises(session_id);
        CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON SessionExercises(exercise_id);
        CREATE INDEX IF NOT EXISTS idx_session_sets_session_exercise_id ON SessionSets(session_exercise_id);
        
        -- Indexes for exercise history and max tracking
        CREATE INDEX IF NOT EXISTS idx_exercise_max_history_user_id ON ExerciseMaxHistory(user_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_max_history_exercise_id ON ExerciseMaxHistory(exercise_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_max_history_user_exercise ON ExerciseMaxHistory(user_id, exercise_id);
        
        -- Indexes for soreness tracking
        CREATE INDEX IF NOT EXISTS idx_muscle_soreness_history_user_id ON MuscleSorenessHistory(user_id);
        CREATE INDEX IF NOT EXISTS idx_muscle_soreness_history_muscle_group_id ON MuscleSorenessHistory(muscle_group_id);
        CREATE INDEX IF NOT EXISTS idx_muscle_soreness_history_created_at ON MuscleSorenessHistory(created_at);
        
        -- Indexes for favorite graphs
        CREATE INDEX IF NOT EXISTS idx_favorite_graphs_user_id ON FavoriteGraphs(user_id);
        CREATE INDEX IF NOT EXISTS idx_favorite_graphs_exercise_id ON FavoriteGraphs(exercise_id);
        
        -- Composite indexes for common query patterns
        CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_start_time ON WorkoutSessions(user_id, start_time);
        CREATE INDEX IF NOT EXISTS idx_session_exercises_session_exercise ON SessionExercises(session_id, exercise_id);
    `);
}

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
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            ss.id AS set_id,
            ss.weight,
            ss.reps,
            CASE 
                WHEN ss.weight = MAX(ss.weight) OVER (PARTITION BY se.id)
                     AND ss.reps = MAX(CASE WHEN ss.weight = MAX(ss.weight) OVER (PARTITION BY se.id) THEN ss.reps END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_heaviest_set,
            CASE 
                WHEN ss.estimated_1rm = MAX(ss.estimated_1rm) OVER (PARTITION BY se.id)
                     AND ss.weight = MAX(CASE WHEN ss.estimated_1rm = MAX(ss.estimated_1rm) OVER (PARTITION BY se.id) THEN ss.weight END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_top_set,
            CASE 
                WHEN ss.reps = MAX(ss.reps) OVER (PARTITION BY se.id)
                     AND ss.weight = MAX(CASE WHEN ss.reps = MAX(ss.reps) OVER (PARTITION BY se.id) THEN ss.weight END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_most_reps_set
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id;

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

export const createDataViews = async (db) => {
    await createWorkoutViews(db);
    await createExerciseViews(db);
    await createSorenessViews(db);
    await createSplitViews(db);
};

export const dropTables = async (db) => {
    // Your table deletion logic here
    await db.execAsync(`
        DROP TABLE IF EXISTS ExerciseSets;
        DROP TABLE IF EXISTS RoutineExercises;
        DROP TABLE IF EXISTS RoutineFavorites;
        DROP TABLE IF EXISTS Routines;
        DROP TABLE IF EXISTS Users;
        DROP TABLE IF EXISTS UserProfileStats;
        DROP TABLE IF EXISTS ExerciseMuscles;
        DROP TABLE IF EXISTS Exercises;
        DROP TABLE IF EXISTS Equipment;
        DROP TABLE IF EXISTS Muscles;
        DROP TABLE IF EXISTS MuscleGroups;
        DROP TABLE IF EXISTS Splits;
        DROP TABLE IF EXISTS SplitRoutines;
        DROP TABLE IF EXISTS WorkoutSessions;
        DROP TABLE IF EXISTS SessionExercises;
        DROP TABLE IF EXISTS SessionSets;
        DROP TABLE IF EXISTS ExerciseMaxHistory;
        DROP TABLE IF EXISTS SplitCompletions;
        DROP TABLE IF EXISTS FavoriteGraphs;
        DROP TABLE IF EXISTS MuscleSorenessHistory;
        DROP TABLE IF EXISTS UserMuscleMaxSoreness;
        DROP TABLE IF EXISTS UserIndividualMuscleMaxSoreness;
    `);
};

export const dropViews = async (db) => {
    // Your view deletion logic here
    await db.execAsync(`
        DROP VIEW IF EXISTS WorkoutFrequency;
        DROP VIEW IF EXISTS MuscleGroupIntensity;
        DROP VIEW IF EXISTS MuscleGroupFocus;
        DROP VIEW IF EXISTS FavoriteRoutines;
        DROP VIEW IF EXISTS StrengthProgress;
        DROP VIEW IF EXISTS SplitCycleLengths;
        DROP VIEW IF EXISTS ExerciseSessionStats;
        DROP VIEW IF EXISTS ExerciseStatSets;
        DROP VIEW IF EXISTS ExerciseSessionStatDetails;
        DROP VIEW IF EXISTS MuscleGroupSoreness;
        DROP VIEW IF EXISTS MuscleSoreness;
    `);
}

export const syncData = async (db) => {
    // Add Users and Workout data to the database
    const user = {
        username: 'john_doe',
        name: 'John Doe',
        email: '',
        password: 'password123',
    };
    const userId = await insertUser(db, user);

    // Add User Profile Stats
    const userProfileStats = {
        height: userData.stats.height,
        weight: userData.stats.weight,
        bodyFat: userData.stats.bodyFat,
        favoriteExercise: userData.stats.favoriteExercise,
        memberSince: userData.stats.memberSince,
        goals: userData.stats.goals,
    };
    await insertUserProfileStats(db, userId, userProfileStats);

    // SYNC WORKOUT DATA
    /*
        1. Sync Muscle Groups
        2. Sync Muscles
        3. Sync Exercises
        4. Sync ExerciseMuscles
        5. Create a few default routines
        6. Sync RoutineExercises
    */
    await syncTables(db);
}
    

export const setupDatabase = async (db) => {
    // Your database setup logic here
    await dropTables(db);
    await dropViews(db);
    await createTables(db);
    await syncData(db);
};

/**
 * Add the UserIndividualMuscleMaxSoreness table for existing users.
 * This function is called during app startup for users who don't have this table yet.
 * @param {Object} db - The database connection object
 */
export const addIndividualMuscleSorenessTable = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness (
            user_id INTEGER NOT NULL,
            muscle_id INTEGER NOT NULL,
            max_soreness REAL NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, muscle_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );
    `);
};

export const replaceSorenessViews = async (db) => {
    await db.execAsync(`
        DROP VIEW IF EXISTS MuscleSoreness;
        DROP VIEW IF EXISTS MuscleGroupSoreness;
    `);
    await db.execAsync(`
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
}

/**
 * Recreate optimized views for existing databases.
 * This function drops and recreates the ExerciseStatSets and ExerciseSessionStatDetails views
 * with optimized queries using window functions and CTEs.
 * @param {Object} db - The database connection object
 */
export const recreateOptimizedViews = async (db) => {
    await db.execAsync(`
        DROP VIEW IF EXISTS ExerciseStatSets;
        DROP VIEW IF EXISTS ExerciseSessionStatDetails;
    `);
    await db.execAsync(`
        CREATE VIEW ExerciseStatSets AS
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            ss.id AS set_id,
            ss.weight,
            ss.reps,
            CASE 
                WHEN ss.weight = MAX(ss.weight) OVER (PARTITION BY se.id)
                     AND ss.reps = MAX(CASE WHEN ss.weight = MAX(ss.weight) OVER (PARTITION BY se.id) THEN ss.reps END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_heaviest_set,
            CASE 
                WHEN ss.estimated_1rm = MAX(ss.estimated_1rm) OVER (PARTITION BY se.id)
                     AND ss.weight = MAX(CASE WHEN ss.estimated_1rm = MAX(ss.estimated_1rm) OVER (PARTITION BY se.id) THEN ss.weight END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_top_set,
            CASE 
                WHEN ss.reps = MAX(ss.reps) OVER (PARTITION BY se.id)
                     AND ss.weight = MAX(CASE WHEN ss.reps = MAX(ss.reps) OVER (PARTITION BY se.id) THEN ss.weight END) OVER (PARTITION BY se.id)
                THEN 1 ELSE 0
            END AS is_most_reps_set
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id;

        CREATE VIEW ExerciseSessionStatDetails AS
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

export const initializeDatabase = async (db) => {
    try {
        const isFirstLaunch = await AsyncStorage.getItem('firstLaunch');
        // Add a version key for exercise table repopulation
        const exerciseTablesV2 = await AsyncStorage.getItem('exerciseTablesV2');
        // Add a version key for UserIndividualMuscleMaxSoreness table
        const individualMuscleSorenessTableV1 = await AsyncStorage.getItem('individualMuscleSorenessTableV1');
        // Add a version key for new exercises migration
        const exercisesV3NewMuscles = await AsyncStorage.getItem('exercisesV3NewMuscles');
        // Add a version key for performance indexes
        const performanceIndexesV1 = await AsyncStorage.getItem('performanceIndexesV1');
        // Add a version key for optimized views
        const optimizedViewsV1 = await AsyncStorage.getItem('optimizedViewsV1');
        
        if (isFirstLaunch === null) {
            // First time launch
            await setupDatabase(db);
            await AsyncStorage.setItem('firstLaunch', 'false');
            await AsyncStorage.setItem('exerciseTablesV2', 'true');
            await AsyncStorage.setItem('individualMuscleSorenessTableV1', 'true');
            await AsyncStorage.setItem('exercisesV3NewMuscles', 'true');
            await AsyncStorage.setItem('performanceIndexesV1', 'true');
            await AsyncStorage.setItem('optimizedViewsV1', 'true');
        } else {
            if (!exerciseTablesV2) {
                // Run repopulation for all users on update
                await repopulateExerciseTables(db);
                await AsyncStorage.setItem('exerciseTablesV2', 'true');
            }
            if (!individualMuscleSorenessTableV1) {
                // Add UserIndividualMuscleMaxSoreness table for existing users
                await addIndividualMuscleSorenessTable(db);
                await AsyncStorage.setItem('individualMuscleSorenessTableV1', 'true');
            }
            if (!exercisesV3NewMuscles) {
                // Migrate exercises to use new muscles list
                const { migrateToNewExercises } = await import('@/api/migrateExercises');
                await migrateToNewExercises(db);
                await replaceSorenessViews(db);
                await AsyncStorage.setItem('exercisesV3NewMuscles', 'true');
            }
            if (!performanceIndexesV1) {
                // Add performance indexes for existing users
                await createIndexes(db);
                await AsyncStorage.setItem('performanceIndexesV1', 'true');
            }
            if (!optimizedViewsV1) {
                // Recreate optimized views for existing users
                await recreateOptimizedViews(db);
                await AsyncStorage.setItem('optimizedViewsV1', 'true');
            }
        }
        // Open a connection to the SQLite database.
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

/**
 * Drop only the Exercises and ExerciseMuscles tables.
 * Note: ExerciseMuscles is dropped first due to foreign key constraint.
 * @param {Object} db - The database connection object
 */
export const dropExerciseTables = async (db) => {
    // Drop ExerciseMuscles first due to foreign key constraint
    await db.execAsync(`
        DROP TABLE IF EXISTS ExerciseMuscles;
        DROP TABLE IF EXISTS Exercises;
    `);
};

/**
 * Create only the Exercises and ExerciseMuscles tables.
 * @param {Object} db - The database connection object
 */
export const createExerciseTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            equipment_id INTEGER,
            muscle_group_id INTEGER,
            FOREIGN KEY (equipment_id) REFERENCES Equipment(id),
            FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
        );
        CREATE TABLE IF NOT EXISTS ExerciseMuscles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_id INTEGER,
            muscle_id INTEGER,
            intensity REAL NOT NULL,
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );
    `);
};

/**
 * Drop, recreate, and repopulate the Exercises and ExerciseMuscles tables.
 * This function performs a complete refresh of exercise data from JSON files.
 * @param {Object} db - The database connection object
 */
export const repopulateExerciseTables = async (db) => {
    await dropExerciseTables(db);
    await createExerciseTables(db);
    // Import and sync exercises data from JSON
    const { syncExercises } = await import('@/api/sync');
    await syncExercises(db);
};

/**
 * Drop only the Routines, RoutineExercises, and ExerciseSets tables for sample data.
 * Note: Tables are dropped in reverse order of dependencies due to foreign key constraints.
 * @param {Object} db - The database connection object
 */
export const dropRoutineTables = async (db) => {
    // Drop ExerciseSets first, then RoutineExercises, then Routines due to foreign key constraints
    await db.execAsync(`
        DROP TABLE IF EXISTS ExerciseSets;
        DROP TABLE IF EXISTS RoutineExercises;
        DROP TABLE IF EXISTS Routines;
    `);
};

/**
 * Create only the Routines, RoutineExercises, and ExerciseSets tables.
 * @param {Object} db - The database connection object
 */
export const createRoutineTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Routines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        );
        CREATE TABLE IF NOT EXISTS RoutineExercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            routine_id INTEGER,
            exercise_id INTEGER,
            FOREIGN KEY (routine_id) REFERENCES Routines(id),
            FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
        );
        CREATE TABLE IF NOT EXISTS ExerciseSets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            routine_exercise_id INTEGER,
            set_order INTEGER NOT NULL,
            weight REAL NOT NULL,
            reps INTEGER NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (routine_exercise_id) REFERENCES RoutineExercises(id)
        );
    `);
};

/**
 * Drop, recreate, and repopulate the Routines, RoutineExercises, and ExerciseSets tables.
 * This function performs a complete refresh of sample routine data from JSON files.
 * @param {Object} db - The database connection object
 */
export const repopulateRoutineTables = async (db) => {
    await dropRoutineTables(db);
    await createRoutineTables(db);
    // Import and sync routines data from JSON
    const { syncRoutines } = await import('@/api/sync');
    await syncRoutines(db);
};