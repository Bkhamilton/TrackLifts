// Manual test script for weighted muscle soreness calculation
const fs = require('fs');
const path = require('path');

// Load MuscleRatio.json
const muscleRatios = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/MuscleRatio.json'), 'utf8')
);

// Utility functions (copied from muscleSorenessCalculations.js)
const createRatioMap = () => {
    const ratioMap = {};
    muscleRatios.forEach(group => {
        ratioMap[group.muscle_group] = {};
        group.muscles.forEach(muscle => {
            ratioMap[group.muscle_group][muscle.name] = muscle.ratio;
        });
    });
    return ratioMap;
};

const normalizeMuscleSoreness = (muscleSoreness, maxSoreness) => {
    if (maxSoreness === 0 || maxSoreness === null || maxSoreness === undefined) {
        return 0;
    }
    return Math.min(muscleSoreness / maxSoreness, 1.0);
};

const calculateWeightedMuscleGroupSoreness = (muscleGroupName, muscles, ratioMap) => {
    if (!muscles || muscles.length === 0) {
        return 0;
    }

    const groupRatios = ratioMap[muscleGroupName];
    if (!groupRatios) {
        console.warn(`No ratio data found for muscle group: ${muscleGroupName}`);
        const avgSoreness = muscles.reduce((sum, m) => {
            return sum + normalizeMuscleSoreness(m.soreness_score || 0, m.max_soreness || 1);
        }, 0) / muscles.length;
        return avgSoreness;
    }

    let weightedSum = 0;
    let totalRatioUsed = 0;

    muscles.forEach(muscle => {
        const muscleName = muscle.muscle_name;
        const ratio = groupRatios[muscleName];

        if (ratio !== undefined) {
            const normalizedSoreness = normalizeMuscleSoreness(
                muscle.soreness_score || 0,
                muscle.max_soreness || 1
            );
            weightedSum += normalizedSoreness * ratio;
            totalRatioUsed += ratio;
        }
    });

    return weightedSum;
};

// Test cases
console.log('=== Weighted Muscle Soreness Calculation Tests ===\n');

const ratioMap = createRatioMap();

// Test 1: Example from documentation
console.log('Test 1: Chest example from documentation');
const chestMuscles = [
    { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 },
    { muscle_name: 'Upper Chest', soreness_score: 600, max_soreness: 800 },
    { muscle_name: 'Lower Chest', soreness_score: 400, max_soreness: 500 }
];
const chestResult = calculateWeightedMuscleGroupSoreness('Chest', chestMuscles, ratioMap);
console.log(`Expected: 0.785 (78.5%)`);
console.log(`Actual: ${chestResult.toFixed(3)} (${(chestResult * 100).toFixed(1)}%)`);
console.log(`✓ Test ${Math.abs(chestResult - 0.785) < 0.001 ? 'PASSED' : 'FAILED'}\n`);

// Test 2: Missing muscles
console.log('Test 2: Missing muscles (only main chest trained)');
const partialChestMuscles = [
    { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 }
];
const partialResult = calculateWeightedMuscleGroupSoreness('Chest', partialChestMuscles, ratioMap);
console.log(`Expected: 0.48 (48%)`);
console.log(`Actual: ${partialResult.toFixed(3)} (${(partialResult * 100).toFixed(1)}%)`);
console.log(`✓ Test ${Math.abs(partialResult - 0.48) < 0.001 ? 'PASSED' : 'FAILED'}\n`);

// Test 3: All muscles at 100%
console.log('Test 3: All chest muscles at 100% soreness');
const fullChestMuscles = [
    { muscle_name: 'Chest', soreness_score: 1000, max_soreness: 1000 },
    { muscle_name: 'Upper Chest', soreness_score: 800, max_soreness: 800 },
    { muscle_name: 'Lower Chest', soreness_score: 500, max_soreness: 500 }
];
const fullResult = calculateWeightedMuscleGroupSoreness('Chest', fullChestMuscles, ratioMap);
console.log(`Expected: 1.0 (100%)`);
console.log(`Actual: ${fullResult.toFixed(3)} (${(fullResult * 100).toFixed(1)}%)`);
console.log(`✓ Test ${Math.abs(fullResult - 1.0) < 0.001 ? 'PASSED' : 'FAILED'}\n`);

// Test 4: All muscles at 0%
console.log('Test 4: All chest muscles at 0% soreness');
const zeroChestMuscles = [
    { muscle_name: 'Chest', soreness_score: 0, max_soreness: 1000 },
    { muscle_name: 'Upper Chest', soreness_score: 0, max_soreness: 800 },
    { muscle_name: 'Lower Chest', soreness_score: 0, max_soreness: 500 }
];
const zeroResult = calculateWeightedMuscleGroupSoreness('Chest', zeroChestMuscles, ratioMap);
console.log(`Expected: 0.0 (0%)`);
console.log(`Actual: ${zeroResult.toFixed(3)} (${(zeroResult * 100).toFixed(1)}%)`);
console.log(`✓ Test ${Math.abs(zeroResult - 0.0) < 0.001 ? 'PASSED' : 'FAILED'}\n`);

// Test 5: Verify ratios sum to 1.0
console.log('Test 5: Verify all muscle group ratios sum to 1.0');
let allRatiosValid = true;
Object.keys(ratioMap).forEach(group => {
    const ratios = Object.values(ratioMap[group]);
    const sum = ratios.reduce((a, b) => a + b, 0);
    const isValid = Math.abs(sum - 1.0) < 0.001;
    console.log(`  ${group}: ${sum.toFixed(3)} - ${isValid ? '✓' : '✗'}`);
    if (!isValid) allRatiosValid = false;
});
console.log(`✓ Test ${allRatiosValid ? 'PASSED' : 'FAILED'}\n`);

console.log('=== All Tests Complete ===');
