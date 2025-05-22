import { syncTables } from '@/api/sync';
import { insertUser } from '@/db/user/Users';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createTables = async (db) => {
    // Your table creation logic here
    await createGeneralTables(db);
    await createUserTables(db);
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
            sets INTEGER NOT NULL,
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
            routine_id INTEGER,
            FOREIGN KEY (routine_id) REFERENCES Routines(id)
        );
    `);
}

export const dropTables = async (db) => {
    // Your table deletion logic here
    await db.execAsync(`
        DROP TABLE IF EXISTS ExerciseSets;
        DROP TABLE IF EXISTS RoutineExercises;
        DROP TABLE IF EXISTS Routines;
        DROP TABLE IF EXISTS Users;
        DROP TABLE IF EXISTS ExerciseMuscles;
        DROP TABLE IF EXISTS Exercises;
        DROP TABLE IF EXISTS Equipment;
        DROP TABLE IF EXISTS Muscles;
        DROP TABLE IF EXISTS MuscleGroups;
    `);
};

export const syncData = async (db) => {
    // Add Users and Workout data to the database
    const user = {
        username: 'john_doe',
        name: 'John Doe',
        email: '',
        password: 'password123',
    };
    await insertUser(db, user);

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