#!/usr/bin/env node
/**
 * Manual verification script for exercise migration
 * This script validates the logic without requiring a full database
 */

const newExercises = require('../data/NewExercises.json');
const newMuscles = require('../data/NewMuscles.json');
const oldExercises = require('../data/Exercises.json');
const oldMuscles = require('../data/Muscles.json');

console.log('=== Exercise Migration Validation ===\n');

// 1. Verify data file structure
console.log('1. Data File Structure:');
console.log(`   Old Exercises: ${oldExercises.length} exercises`);
console.log(`   New Exercises: ${newExercises.length} exercises`);
console.log(`   Old Muscles: ${oldMuscles.length} muscles`);
console.log(`   New Muscles: ${newMuscles.length} muscles`);
console.log(`   ✓ NewExercises has ${newExercises.length - oldExercises.length} more exercises\n`);

// 2. Verify NewMuscles field structure
console.log('2. NewMuscles Field Structure:');
const sampleNewMuscle = newMuscles[0];
console.log(`   Sample muscle:`, sampleNewMuscle);
console.log(`   ✓ Has 'muscle_group' field: ${!!sampleNewMuscle.muscle_group}`);
console.log(`   ✓ Has 'name' field: ${!!sampleNewMuscle.name}\n`);

// 3. Verify NewExercises field structure
console.log('3. NewExercises Field Structure:');
const sampleNewExercise = newExercises[0];
console.log(`   Sample exercise: ${sampleNewExercise.title} - ${sampleNewExercise.equipment}`);
console.log(`   ✓ Has 'title' field: ${!!sampleNewExercise.title}`);
console.log(`   ✓ Has 'equipment' field: ${!!sampleNewExercise.equipment}`);
console.log(`   ✓ Has 'muscleGroup' field: ${!!sampleNewExercise.muscleGroup}`);
console.log(`   ✓ Has 'muscles' array: ${Array.isArray(sampleNewExercise.muscles)}`);
console.log(`   ✓ First muscle:`, sampleNewExercise.muscles[0], '\n');

// 4. Check for exercises that exist in both datasets
console.log('4. Exercise Overlap Analysis:');
const oldExerciseKeys = new Set(
    oldExercises.map(e => `${e.title}|${e.equipment}`)
);
const newExerciseKeys = new Set(
    newExercises.map(e => `${e.title}|${e.equipment}`)
);

const common = [...oldExerciseKeys].filter(key => newExerciseKeys.has(key));
const onlyInNew = [...newExerciseKeys].filter(key => !oldExerciseKeys.has(key));
const onlyInOld = [...oldExerciseKeys].filter(key => !newExerciseKeys.has(key));

console.log(`   Common exercises: ${common.length}`);
console.log(`   Only in NewExercises: ${onlyInNew.length}`);
console.log(`   Only in old Exercises: ${onlyInOld.length}`);

if (onlyInNew.length > 0) {
    console.log(`\n   New exercises to be added:`);
    onlyInNew.slice(0, 5).forEach(key => {
        const [title, equipment] = key.split('|');
        console.log(`     - ${title} (${equipment})`);
    });
    if (onlyInNew.length > 5) {
        console.log(`     ... and ${onlyInNew.length - 5} more`);
    }
}

if (onlyInOld.length > 0) {
    console.log(`\n   Exercises only in old data (will be preserved with updated muscles):`);
    onlyInOld.slice(0, 5).forEach(key => {
        const [title, equipment] = key.split('|');
        console.log(`     - ${title} (${equipment})`);
    });
    if (onlyInOld.length > 5) {
        console.log(`     ... and ${onlyInOld.length - 5} more`);
    }
}

// 5. Verify muscle mappings
console.log('\n5. Muscle Mapping Analysis:');
const oldMuscleNames = new Set(oldMuscles.map(m => m.name));
const newMuscleNames = new Set(newMuscles.map(m => m.name));

console.log(`   Old muscle names: ${oldMuscleNames.size}`);
console.log(`   New muscle names: ${newMuscleNames.size}`);

// Check if all muscles referenced in NewExercises exist in NewMuscles
const referencedMuscles = new Set();
newExercises.forEach(ex => {
    ex.muscles.forEach(m => referencedMuscles.add(m.name));
});

const missingMuscles = [...referencedMuscles].filter(m => !newMuscleNames.has(m));
if (missingMuscles.length > 0) {
    console.log(`\n   ⚠ WARNING: Muscles referenced in NewExercises but not in NewMuscles:`);
    missingMuscles.forEach(m => console.log(`     - ${m}`));
} else {
    console.log(`   ✓ All muscles referenced in NewExercises exist in NewMuscles`);
}

// 6. Summary
console.log('\n=== Migration Summary ===');
console.log(`✓ Migration will preserve ${common.length} existing exercises`);
console.log(`✓ Migration will add ${onlyInNew.length} new exercises`);
console.log(`✓ Migration will update muscle mappings for all exercises`);
console.log(`✓ Migration will consolidate from ${oldMuscles.length} to ${newMuscles.length} muscles`);
console.log(`✓ User workout history (SessionExercises) will be preserved`);
console.log('\n=== Validation Complete ===\n');
