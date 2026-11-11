import { withWorkoutDataLock } from '../../utils/workoutDataLock.js';

export const getExercises = async (db) => {
    try {
        const query = `
            SELECT e.id, e.title, e.equipment_id, e.muscle_group_id, 
                   eq.name AS equipment, mg.name AS muscleGroup
            FROM Exercises e
            LEFT JOIN Equipment eq ON e.equipment_id = eq.id
            LEFT JOIN MuscleGroups mg ON e.muscle_group_id = mg.id
            ORDER BY e.title
            `;

        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error getting exercises:', error);
        throw error;
    }
};

export const getExerciseIdByTitleAndEquipment = async (db, title, equipment) => {
    try {
        const query = `
            SELECT e.id
            FROM Exercises e
            LEFT JOIN Equipment eq ON e.equipment_id = eq.id
            WHERE e.title = ? AND eq.name = ?
            `;
        const rows = await db.getAllAsync(query, [title, equipment]);
        return rows.length > 0 ? rows[0].id : null;
    } catch (error) {
        console.error('Error getting exercise ID:', error);
        throw error;
    }
}

export const insertExercise = async (db, exercise) => {
    try {
        const { title, equipmentId, muscleGroupId } = exercise;
        const result = await db.runAsync(
            'INSERT INTO Exercises (title, equipment_id, muscle_group_id) VALUES (?, ?, ?)', 
            [title, equipmentId, muscleGroupId]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting exercise:', error);
        throw error;
    }
};

export const updateExercise = async (db, id, title, equipmentId, muscleGroupId) => {
    try {
        await db.runAsync(
            'UPDATE Exercises SET title = ?, equipment_id = ?, muscle_group_id = ? WHERE id = ?', 
            [title, equipmentId, muscleGroupId, id]
        );
        console.log('Exercise updated');
    } catch (error) {
        console.error('Error updating exercise:', error);
        throw error;
    }
};

export const deleteExercise = async (db, id) => {
    return withWorkoutDataLock(db, async () => {
        await db.runAsync('BEGIN IMMEDIATE');
        try {
            const references = await db.getFirstAsync(`
                SELECT EXISTS(SELECT 1 FROM RoutineExercises WHERE exercise_id = ?)
                    OR EXISTS(SELECT 1 FROM SessionExercises WHERE exercise_id = ?)
                    OR EXISTS(SELECT 1 FROM ExerciseMaxHistory WHERE exercise_id = ?)
                    OR EXISTS(SELECT 1 FROM FavoriteGraphs WHERE exercise_id = ?) AS referenced
            `, [id, id, id, id]);
            if (references.referenced) {
                throw new Error('This exercise is used by a routine, workout, record, or favorite graph and cannot be deleted.');
            }
            await db.runAsync('DELETE FROM ExerciseMuscles WHERE exercise_id = ?', [id]);
            const result = await db.runAsync('DELETE FROM Exercises WHERE id = ?', [id]);
            if (result.changes !== 1) throw new Error('This exercise no longer exists. Reopen the exercise list.');
            await db.runAsync('COMMIT');
        } catch (error) {
            try { await db.runAsync('ROLLBACK'); } catch { /* Preserve the original failure. */ }
            throw error;
        }
    });
};
