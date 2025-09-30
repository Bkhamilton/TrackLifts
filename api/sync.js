import equipment from '@/data/Equipment.json';
import exercises from '@/data/Exercises.json';
import muscleGroups from '@/data/MuscleGroups.json';
import muscles from '@/data/Muscles.json';
import sampleRoutines from '@/data/SampleRoutines.json';
import sampleSplit from '@/data/SampleSplit.json';
import { insertEquipment } from '@/db/general/Equipment';
import { insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { getExerciseIdByTitleAndEquipment, insertExercise } from '@/db/general/Exercises';
import { getMuscleGroupIdByName, insertMuscleGroup } from '@/db/general/MuscleGroups';
import { insertMuscle } from '@/db/general/Muscles';
import { insertExerciseSet } from '@/db/user/ExerciseSets';
import { insertRoutineExercise } from '@/db/user/RoutineExercises';
import { getRoutineByTitle, insertRoutine } from '@/db/user/Routines';
import { insertSplitRoutine } from '@/db/user/SplitRoutines';
import { insertSplit } from '@/db/user/Splits';

export const syncTables = async (db) => {
    await syncMuscleGroups(db);
    await syncMuscles(db);
    await syncEquipment(db);
    await syncExercises(db);
    await syncRoutines(db);
    await syncSplits(db);
}

const syncMuscleGroups = async (db) => {
    for (const muscleGroup of muscleGroups) {
        await insertMuscleGroup(db, muscleGroup);
    }
};

const syncMuscles = async (db) => {
    for (const muscle of muscles) {
        const muscleGroupId = await getMuscleGroupIdByName(db, muscle.muscleGroup);
        const toAdd = {
            name: muscle.name,
            muscleGroupId: muscleGroupId,
        }
        await insertMuscle(db, toAdd);
    }
};

const syncEquipment = async (db) => {
    for (const equip of equipment) {
        await insertEquipment(db, equip);
    }
};

export const syncExercises = async (db) => {
    // Fetch muscle IDs for mapping
    const muscles = await db.getAllAsync('SELECT id, name FROM Muscles');
    const muscleMap = new Map(muscles.map(m => [m.name, m.id]));

    // Fetch muscle group IDs for mapping
    const muscleGroups = await db.getAllAsync('SELECT id, name FROM MuscleGroups');
    const muscleGroupMap = new Map(muscleGroups.map(mg => [mg.name, mg.id]));

    // Fetch equipment IDs for mapping
    const equipmentList = await db.getAllAsync('SELECT id, name FROM Equipment');
    const equipmentMap = new Map(equipmentList.map(e => [e.name, e.id]));

    // Insert exercises and their associated muscles
    for (const exercise of exercises) {
        const muscleGroupId = muscleGroupMap.get(exercise.muscleGroup);
        const equipmentId = equipmentMap.get(exercise.equipment);

        if (muscleGroupId && equipmentId) {
            // Insert the exercise into the Exercises table
            const exerciseId = await insertExercise(db, {
                title: exercise.title,
                equipmentId: equipmentId,
                muscleGroupId: muscleGroupId,
            });

            // Insert associated muscles into ExerciseMuscles table
            for (const muscle of exercise.muscles) {
                const muscleId = muscleMap.get(muscle.name);
                if (muscleId) {
                    await insertExerciseMuscle(db, {
                        exerciseId: exerciseId,
                        muscleId: muscleId,
                        intensity: muscle.value,
                    });
                } else {
                    console.warn(`Muscle "${muscle.name}" not found for exercise "${exercise.title}"`);
                }
            }
        } else {
            if (!muscleGroupId) {
                console.warn(`Muscle group "${exercise.muscleGroup}" not found for exercise "${exercise.title}"`);
            }
            if (!equipmentId) {
                console.warn(`Equipment "${exercise.equipment}" not found for exercise "${exercise.title}"`);
            }
        }
    }
};

const syncRoutines = async (db) => {
    // Insert sample routines, their exercises, and sets
    for (const routine of sampleRoutines) {
        const routineId = await insertRoutine(db, {
            title: routine.title,
            user_id: 1, // Assuming a default user ID
        });

        for (const exercise of routine.exercises) {
            // Fetch the exercise by title and equipment
            const exerciseId = await getExerciseIdByTitleAndEquipment(db, exercise.title, exercise.equipment);

            if (exerciseId) {
                const routineExerciseId = await insertRoutineExercise(db, {
                    routine_id: routineId,
                    exercise_id: exerciseId,
                });

                // Insert each set into the ExerciseSets table
                for (const set of exercise.sets) {
                    await insertExerciseSet(db, {
                        routine_exercise_id: routineExerciseId,
                        set_order: set.order,
                        weight: set.weight,
                        reps: set.reps,
                        date: set.date || new Date().toISOString(), // Use current date if not provided
                    });
                }
            } else {
                console.warn(`Exercise "${exercise.title}" with equipment "${exercise.equipment}" not found for routine "${routine.title}"`);
            }
        }
    }
};

const syncSplits = async (db) => {
    // Handle sampleSplit as an array of split objects
    for (const splitObj of sampleSplit) {
        // Insert each split
        const splitId = await insertSplit(db, {
            name: splitObj.name,
            user_id: 1,
            is_active: splitObj.is_active || 0, // Default to inactive if not specified
        });

        // Insert each routine in the split
        for (const split of splitObj.routines) {
            const routine = await getRoutineByTitle(db, split.routine);
            if (!routine) {
                console.warn(`Routine "${split.routine}" not found for split "${splitObj.name}"`);
                continue;
            }
            await insertSplitRoutine(db, {
                split_id: splitId,
                split_order: split.day,
                routine_id: routine.id,
            });

            // You would need to implement the logic to handle the split routines
            console.log(`Syncing split routine: ${split.routine} for split: ${splitObj.name}`);
        }
    }
}