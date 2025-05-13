import equipment from '@/data/Equipment.json';
import exercises from '@/data/Exercises.json';
import muscleGroups from '@/data/MuscleGroups.json';
import muscles from '@/data/Muscles.json';
import { insertEquipment } from '@/db/general/Equipment';
import { insertExerciseMuscle } from '@/db/general/ExerciseMuscles';
import { getExerciseIdByTitleAndEquipment, insertExercise } from '@/db/general/Exercises';
import { insertMuscleGroup } from '@/db/general/MuscleGroups';
import { insertMuscle } from '@/db/general/Muscles';
import { insertExerciseSet } from '@/db/user/ExerciseSets';
import { insertRoutineExercise } from '@/db/user/RoutineExercises';
import { insertRoutine } from '@/db/user/Routines';

export const syncTables = async (db) => {
    await syncMuscleGroups(db);
    await syncMuscles(db);
    await syncEquipment(db);
    await syncExercises(db);
    await syncRoutines(db);
}

const syncMuscleGroups = async (db) => {
    for (const muscleGroup of muscleGroups) {
        await insertMuscleGroup(db, muscleGroup);
    }
};

const syncMuscles = async (db) => {
    for (const muscle of muscles) {
        await insertMuscle(db, muscle);
    }
};

const syncEquipment = async (db) => {
    for (const equip of equipment) {
        await insertEquipment(db, equip);
    }
};

const syncExercises = async (db) => {
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
                        exercise_id: exerciseId,
                        muscle_id: muscleId,
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
    // Create a few sample routines with sets and weights
    const sampleRoutines = [
        {
            title: 'Full Body Workout',
            exercises: [
                {
                    title: 'Squat',
                    equipment: 'Barbell',
                    sets: [
                        { weight: 200, reps: 10 },
                        { weight: 210, reps: 8 },
                        { weight: 220, reps: 6 },
                    ],
                },
                {
                    title: 'Bench Press',
                    equipment: 'Barbell',
                    sets: [
                        { weight: 150, reps: 10 },
                        { weight: 160, reps: 8 },
                        { weight: 170, reps: 6 },
                    ],
                },
                {
                    title: 'Deadlift',
                    equipment: 'Barbell',
                    sets: [
                        { weight: 250, reps: 10 },
                        { weight: 260, reps: 8 },
                        { weight: 270, reps: 6 },
                    ],
                },
            ],
        },
        {
            title: 'Upper Body Workout',
            exercises: [
                {
                    title: 'Pull-Up',
                    equipment: 'Bodyweight',
                    sets: [
                        { weight: 0, reps: 8 },
                        { weight: 0, reps: 8 },
                        { weight: 0, reps: 8 },
                    ],
                },
                {
                    title: 'Shoulder Press',
                    equipment: 'Dumbbell',
                    sets: [
                        { weight: 40, reps: 10 },
                        { weight: 45, reps: 8 },
                        { weight: 50, reps: 6 },
                    ],
                },
                {
                    title: 'Incline Curl',
                    equipment: 'Barbell',
                    sets: [
                        { weight: 30, reps: 12 },
                        { weight: 35, reps: 10 },
                        { weight: 40, reps: 8 },
                    ],
                },
            ],
        },
    ];

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
                    sets: exercise.sets.length, // Total number of sets
                });

                // Insert each set into the ExerciseSets table
                for (const set of exercise.sets) {
                    await insertExerciseSet(db, {
                        routine_exercise_id: routineExerciseId,
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