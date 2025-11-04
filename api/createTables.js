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

export const createTables = async (db) => {
    // Your table creation logic here
    await createGeneralTables(db);
    await createUserTables(db);
    await createWorkoutTables(db);
    await createIndexes(db);
};