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
                WHEN ss.id = (
                    SELECT s2.id
                    FROM SessionSets s2
                    WHERE s2.session_exercise_id = se.id
                    ORDER BY s2.weight DESC, s2.reps DESC
                    LIMIT 1
                ) THEN 1 ELSE 0
            END AS is_heaviest_set,
            CASE 
                WHEN ss.id = (
                    SELECT s2.id
                    FROM SessionSets s2
                    WHERE s2.session_exercise_id = se.id
                    ORDER BY s2.estimated_1rm DESC, s2.weight DESC
                    LIMIT 1
                ) THEN 1 ELSE 0
            END AS is_top_set,
            CASE 
                WHEN ss.id = (
                    SELECT s2.id
                    FROM SessionSets s2
                    WHERE s2.session_exercise_id = se.id
                    ORDER BY s2.reps DESC, s2.weight DESC
                    LIMIT 1
                ) THEN 1 ELSE 0
            END AS is_most_reps_set
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id;

        CREATE VIEW IF NOT EXISTS ExerciseSessionStatDetails AS
        SELECT
            ws.id AS session_id,
            ws.user_id,
            ws.start_time AS workout_date,
            se.exercise_id,
            (SELECT ss1.weight FROM SessionSets ss1
                WHERE ss1.session_exercise_id = se.id
                ORDER BY ss1.weight DESC, ss1.reps DESC
                LIMIT 1) AS heaviest_set_weight,
            (SELECT ss1.reps FROM SessionSets ss1
                WHERE ss1.session_exercise_id = se.id
                ORDER BY ss1.weight DESC, ss1.reps DESC
                LIMIT 1) AS heaviest_set_reps,
            (SELECT ss2.weight FROM SessionSets ss2
                WHERE ss2.session_exercise_id = se.id
                ORDER BY ss2.estimated_1rm DESC, ss2.weight DESC
                LIMIT 1) AS top_set_weight,
            (SELECT ss2.reps FROM SessionSets ss2
                WHERE ss2.session_exercise_id = se.id
                ORDER BY ss2.estimated_1rm DESC, ss2.weight DESC
                LIMIT 1) AS top_set_reps,
            (SELECT ss3.weight FROM SessionSets ss3
                WHERE ss3.session_exercise_id = se.id
                ORDER BY ss3.reps DESC, ss3.weight DESC
                LIMIT 1) AS most_reps_weight,
            (SELECT ss3.reps FROM SessionSets ss3
                WHERE ss3.session_exercise_id = se.id
                ORDER BY ss3.reps DESC, ss3.weight DESC
                LIMIT 1) AS most_reps_reps,
            SUM(ss.weight * ss.reps) AS total_volume,
            AVG(ss.weight) AS avg_weight
        FROM WorkoutSessions ws
        JOIN SessionExercises se ON ws.id = se.session_id
        JOIN SessionSets ss ON se.id = ss.session_exercise_id
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
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1 THEN 1.0
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2 THEN 0.8
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 3 THEN 0.65
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 4 THEN 0.55
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 5 THEN 0.45
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 7 THEN 0.3
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
        WHERE ws.start_time >= date('now', '-14 days')
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
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 1 THEN 1.0
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 2 THEN 0.8
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 3 THEN 0.65
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 4 THEN 0.55
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 5 THEN 0.45
                    WHEN (julianday('now') - julianday(ws.start_time)) <= 7 THEN 0.3
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
        WHERE ws.start_time >= date('now', '-14 days')
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

export const initializeDatabase = async (db) => {
    try {
        const isFirstLaunch = await AsyncStorage.getItem('firstLaunch');
        if (isFirstLaunch === null) {
            // First time launch
            await setupDatabase(db);
            await AsyncStorage.setItem('firstLaunch', 'false');
        }
        // Open a connection to the SQLite database.
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};