#!/usr/bin/env node
/**
 * Integration test for exercise migration
 * Simulates the migration process without requiring a database
 */

const newExercises = require('../data/NewExercises.json');
const newMuscles = require('../data/NewMuscles.json');

console.log('\n=== Integration Test: Exercise Migration ===\n');

let passedTests = 0;
let totalTests = 0;

function test(description, assertion) {
    totalTests++;
    try {
        if (assertion) {
            console.log(`✓ ${description}`);
            passedTests++;
        } else {
            console.log(`✗ ${description}`);
        }
    } catch (error) {
        console.log(`✗ ${description} - Error: ${error.message}`);
    }
}

// Test 1: NewMuscles structure
test('NewMuscles has correct structure', 
    newMuscles.every(m => m.name && m.muscle_group && m.anatomical_name));

// Test 2: NewExercises structure
test('NewExercises has correct structure', 
    newExercises.every(e => e.title && e.equipment && e.muscleGroup && Array.isArray(e.muscles)));

// Test 3: All muscles in NewExercises exist in NewMuscles
const muscleNames = new Set(newMuscles.map(m => m.name));
const referencedMuscles = new Set();
newExercises.forEach(e => e.muscles.forEach(m => referencedMuscles.add(m.name)));
const allMusclesExist = [...referencedMuscles].every(m => muscleNames.has(m));
test('All referenced muscles exist in NewMuscles', allMusclesExist);

// Test 4: Muscle groups are valid
const validMuscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
const allGroupsValid = newMuscles.every(m => validMuscleGroups.includes(m.muscle_group));
test('All muscle groups are valid', allGroupsValid);

// Test 5: Exercise muscle intensities are valid
const allIntensitiesValid = newExercises.every(e => 
    e.muscles.every(m => m.value >= 0 && m.value <= 1)
);
test('All muscle intensities are between 0 and 1', allIntensitiesValid);

// Test 6: No duplicate exercises
const exerciseKeys = newExercises.map(e => `${e.title}|${e.equipment}`);
const uniqueKeys = new Set(exerciseKeys);
test('No duplicate exercises', exerciseKeys.length === uniqueKeys.size);

// Test 7: No duplicate muscles
const muscleNamesList = newMuscles.map(m => m.name);
const uniqueMuscles = new Set(muscleNamesList);
test('No duplicate muscles', muscleNamesList.length === uniqueMuscles.size);

// Test 8: Each exercise has at least one muscle
test('Each exercise has at least one muscle', 
    newExercises.every(e => e.muscles.length > 0));

// Test 9: Muscle groups match between exercises and muscles
const exerciseMuscleGroups = new Set(newExercises.map(e => e.muscleGroup));
const muscleMuscleGroups = new Set(newMuscles.map(m => m.muscle_group));
// Full Body is a valid exercise muscle group but muscles are categorized more specifically
const validExerciseMuscleGroups = [...muscleMuscleGroups, 'Full Body'];
const groupsMatch = [...exerciseMuscleGroups].every(g => validExerciseMuscleGroups.includes(g));
test('Exercise muscle groups match muscle definitions', groupsMatch);

// Test 10: NewMuscles has expected count
test('NewMuscles has 28 muscles', newMuscles.length === 28);

// Test 11: NewExercises has expected count
test('NewExercises has 136 exercises', newExercises.length === 136);

// Test 12: Equipment types are consistent
const validEquipment = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Smith Machine', 'Plate Loaded', 'Band', 'Kettlebell', 'Medicine Ball', 'Resistance Band', 'Assisted Bodyweight'];
const allEquipmentValid = newExercises.every(e => validEquipment.includes(e.equipment));
test('All equipment types are valid', allEquipmentValid);

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passedTests}/${totalTests}`);
console.log(`Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
    console.log('\n✓ All tests passed! Migration data is valid.\n');
    process.exit(0);
} else {
    console.log('\n✗ Some tests failed. Please review the data.\n');
    process.exit(1);
}
