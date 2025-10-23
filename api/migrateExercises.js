import newExercises from '@/data/NewExercises.json';
import newMuscles from '@/data/NewMuscles.json';
import { deleteExerciseMuscleByExerciseId, insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { getExerciseIdByTitleAndEquipment, insertExercise } from '@/db/general/Exercises';
import { getMuscleGroupIdByName } from '@/db/general/MuscleGroups';
import { insertMuscle } from '@/db/general/Muscles';

/**
 * Migrate exercises to use new muscles list without disrupting user history.
 * This function:
 * 1. Drops and recreates the Muscles table with NewMuscles data
 * 2. Updates ExerciseMuscles entries for existing exercises
 * 3. Adds new exercises from NewExercises
 * 
 * @param {Object} db - The database connection object
 */
export const migrateToNewExercises = async (db) => {
    try {
        console.log('Starting exercise migration to new muscles...');

        // Step 1: Drop and recreate Muscles table with NewMuscles
        await recreateMusclesTable(db);

        // Step 2: Get all existing exercises
        const existingExercises = await db.getAllAsync(
            'SELECT id, title, equipment_id, muscle_group_id FROM Exercises'
        );

        // Step 3: Create maps for fast lookups
        const equipmentList = await db.getAllAsync('SELECT id, name FROM Equipment');
        const equipmentMap = new Map(equipmentList.map(e => [e.name, e.id]));
        const equipmentIdToName = new Map(equipmentList.map(e => [e.id, e.name]));

        const muscleGroups = await db.getAllAsync('SELECT id, name FROM MuscleGroups');
        const muscleGroupMap = new Map(muscleGroups.map(mg => [mg.name, mg.id]));

        const muscles = await db.getAllAsync('SELECT id, name FROM Muscles');
        const muscleMap = new Map(muscles.map(m => [m.name, m.id]));

        // Step 4: Update ExerciseMuscles for existing exercises
        for (const exercise of existingExercises) {
            const equipmentName = equipmentIdToName.get(exercise.equipment_id);
            
            // Find matching exercise in NewExercises
            const newExercise = newExercises.find(
                ne => ne.title === exercise.title && ne.equipment === equipmentName
            );

            if (newExercise) {
                // Delete old ExerciseMuscles entries
                await deleteExerciseMuscleByExerciseId(db, exercise.id);

                // Insert new ExerciseMuscles entries
                for (const muscle of newExercise.muscles) {
                    const muscleId = muscleMap.get(muscle.name);
                    if (muscleId) {
                        await insertExerciseMuscle(db, {
                            exerciseId: exercise.id,
                            muscleId: muscleId,
                            intensity: muscle.value,
                        });
                    } else {
                        console.warn(`Muscle "${muscle.name}" not found for exercise "${exercise.title}"`);
                    }
                }
            } else {
                console.warn(`Exercise "${exercise.title}" with equipment "${equipmentName}" not found in NewExercises`);
            }
        }

        // Step 5: Add new exercises that don't exist yet
        for (const newExercise of newExercises) {
            const equipmentId = equipmentMap.get(newExercise.equipment);
            const existingId = await getExerciseIdByTitleAndEquipment(
                db,
                newExercise.title,
                newExercise.equipment
            );

            // If exercise doesn't exist, add it
            if (!existingId && equipmentId) {
                const muscleGroupId = muscleGroupMap.get(newExercise.muscleGroup);
                
                if (muscleGroupId) {
                    const exerciseId = await insertExercise(db, {
                        title: newExercise.title,
                        equipmentId: equipmentId,
                        muscleGroupId: muscleGroupId,
                    });

                    // Insert associated muscles
                    for (const muscle of newExercise.muscles) {
                        const muscleId = muscleMap.get(muscle.name);
                        if (muscleId) {
                            await insertExerciseMuscle(db, {
                                exerciseId: exerciseId,
                                muscleId: muscleId,
                                intensity: muscle.value,
                            });
                        }
                    }
                }
            }
        }

        console.log('Exercise migration completed successfully!');
    } catch (error) {
        console.error('Error during exercise migration:', error);
        throw error;
    }
};

/**
 * Drop and recreate the Muscles table with new muscles data.
 * This is safe because user workout history (SessionExercises) doesn't directly
 * reference the Muscles table - it only references Exercises.
 * 
 * @param {Object} db - The database connection object
 */
const recreateMusclesTable = async (db) => {
    try {
        // Drop ExerciseMuscles and Muscles tables
        await db.execAsync(`
            DROP TABLE IF EXISTS ExerciseMuscles;
            DROP TABLE IF EXISTS Muscles;
        `);

        // Recreate Muscles table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Muscles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                muscle_group_id INTEGER,
                FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
            );
        `);

        // Recreate ExerciseMuscles table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ExerciseMuscles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exercise_id INTEGER,
                muscle_id INTEGER,
                intensity REAL NOT NULL,
                FOREIGN KEY (exercise_id) REFERENCES Exercises(id),
                FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
            );
        `);

        // Insert new muscles
        for (const muscle of newMuscles) {
            const muscleGroupId = await getMuscleGroupIdByName(db, muscle.muscle_group);
            if (muscleGroupId) {
                await insertMuscle(db, {
                    name: muscle.name,
                    muscleGroupId: muscleGroupId,
                });
            } else {
                console.warn(`Muscle group "${muscle.muscle_group}" not found for muscle "${muscle.name}"`);
            }
        }

        console.log('Muscles table recreated successfully');
    } catch (error) {
        console.error('Error recreating Muscles table:', error);
        throw error;
    }
};
