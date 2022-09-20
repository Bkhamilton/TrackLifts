import * as SQLite from 'expo-sqlite';

import { Exercise, Routine, Muscle, TLRoutine } from './types/types';

class Database {
    constructor() {
        this.db = SQLite.openDatabase("db.db");
    }

    static getInstance() {
        if (!this.instance)
            this.instance = new Database();
        return this.instance;
    }

    clearTLRoutine(onClear) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                DELETE FROM TLRoutine WHERE rid IS NOT NULL;`,
            [], () => onClear(),
            (transaction, error) => console.log(error));
        });
    }

    initializeExercise(onDatabaseInitialized) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                CREATE TABLE IF NOT EXISTS Exercise (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    title Text,
                    type Text,
                    muscleGroup Text
                );`,
            [], () => onDatabaseInitialized(),
            (transaction, error) => console.log(error));
        });
    }

    initializeRoutine(onDatabaseInitialized) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                CREATE TABLE IF NOT EXISTS Routine (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    title TEXT
                );`,
            [], () => onDatabaseInitialized(),
            (transaction, error) => console.log(error));
        });
    }

    initializeTLRoutine(onDatabaseInitialized) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                CREATE TABLE IF NOT EXISTS TLRoutine (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    rid INTEGER,
                    exid INTEGER
                );`,
            [], () => onDatabaseInitialized(),
            (transaction, error) => console.log(error));
        });
    }

    initializeMuscle(onDatabaseInitialized) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                CREATE TABLE IF NOT EXISTS Muscle (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    muscle Text,
                    muscleGroup Text
                );`,
            [], () => onDatabaseInitialized(),
            (transaction, error) => console.log(error));
        });
    }

    insertExercise(exercise, onInserted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                INSERT INTO Exercise (
                    title,
                    type,
                    muscleGroup
                ) VALUES (?, ?, ?);`, [
                    exercise.title,
                    exercise.type,
                    exercise.muscleGroup,
                ], (transaction, resultSet) => {
                    exercise.id = resultSet.insertId;
                    onInserted(resultSet.insertId);
                },
                (transaction, error) => console.log(error));
        });
    }

    insertRoutine(routine, onInserted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                INSERT INTO Routine (
                    title
                ) VALUES (?);`, [
                    routine.title,
                ], (transaction, resultSet) => {
                    routine.id = resultSet.insertId;
                    onInserted(resultSet.insertId);
                },
                (transaction, error) => console.log(error));
        });
    }

    insertTLRoutine(TLRoutine, onInserted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                INSERT INTO TLRoutine (
                    rid,
                    exid
                ) VALUES (?, ?);`, [
                    TLRoutine.rid,
                    TLRoutine.exid,
                ], (transaction, resultSet) => {
                    TLRoutine.id = resultSet.insertId;
                    onInserted(resultSet.insertId);
                },
                (transaction, error) => console.log(error));
        });
    }

    insertMuscle(muscle, onInserted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                INSERT INTO Muscle (
                    muscle,
                    muscleGroup
                ) VALUES (?);`, [
                    muscle.muscle,
                    muscle.muscleGroup
                ], (transaction, resultSet) => {
                    muscle.id = resultSet.insertId;
                    onInserted(resultSet.insertId);
                },
                (transaction, error) => console.log(error));
        });
    }

    updateExercise(exercise, onUpdated) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                UPDATE Exercise
                SET
                    title = ?,
                    type = ?,
                    muscleGroup = ?
                WHERE id = ?;`, [
                    exercise.title,
                    exercise.type,
                    exercise.muscleGroup,
                    exercise.id
                ], () => onUpdated(),
                (transaction, error) => console.log(error));
        });
    }

    updateRoutine(routine, onUpdated) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                UPDATE Routine
                SET
                    title = ?
                WHERE id = ?;`, [
                    routine.title
                ], () => onUpdated(),
                (transaction, error) => console.log(error));
        });
    }

    deleteExercise(exerciseID, onDeleted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                DELETE FROM Exercise
                WHERE id = ` + exerciseID, 
                (transaction, resultSet) => onDeleted(),
                (transaction, error) => console.log(error));
        });
    }

    deleteRoutine(routineID, onDeleted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                DELETE FROM Routine
                WHERE id = ` + routineID, 
                (transaction, resultSet) => onDeleted(),
                (transaction, error) => console.log(error));
        });
    }

    deleteTLRoutine(routineID, onDeleted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                DELETE FROM TLRoutine
                WHERE rid = ` + routineID, 
                (transaction, resultSet) => onDeleted(),
                (transaction, error) => console.log(error));
        });        
    }

    loadExerciseData(onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM Exercise;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertExerciseList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    loadExerciseSortByData(type, onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM Exercise ORDER BY ` + type + `;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertExerciseList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    loadRoutineData(onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM Routine;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertRoutineList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    loadRoutineInfoData(routineID, onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
            SELECT Exercise.id, Exercise.title, Exercise.type, Exercise.muscleGroup 
            FROM TLRoutine, Routine, Exercise WHERE Exercise.id = TLRoutine.exid AND Routine.id = TLRoutine.rid and Routine.id = ` + routineID + `;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertExerciseList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    loadTLRoutineData(onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM TLRoutine;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertTLRoutineList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    loadMuscleData(onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM Muscle;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertMuscleList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }


    convertExerciseList(dataList) {
        let output = [];
        for (let dataObject of dataList)
            output.push(this.convertExercise(dataObject));
        return output;
    }

    convertRoutineList(dataList) {
        let output = [];
        for (let dataObject of dataList)
            output.push(this.convertRoutine(dataObject));
        return output;
    }

    convertTLRoutineList(dataList) {
        let output = [];
        for (let dataObject of dataList)
            output.push(this.convertTLRoutine(dataObject));
        return output;
    }

    convertMuscleList(dataList) {
        let output = [];
        for (let dataObject of dataList)
            output.push(this.convertMuscle(dataObject));
        return output;
    }

    convertExercise(dataObject) {
        return new Exercise(
            dataObject['id'],
            dataObject['title'],
            dataObject['type'],
            dataObject['muscleGroup']
        );
    }

    convertRoutine(dataObject) {
        return new Routine(
            dataObject['id'],
            dataObject['title']
        );
    }

    convertTLRoutine(dataObject) {
        return new TLRoutine(
            dataObject['id'],
            dataObject['rid'],
            dataObject['exid']
        );
    }

    convertMuscle(dataObject) {
        return new Muscle(
            dataObject['id'],
            dataObject['title'],
            dataObject['muscleGroup']
        );
    }
}

export default Database;