#!/usr/bin/env node

/**
 * Migration Verification Script
 * 
 * This script verifies that the UserIndividualMuscleMaxSoreness migration
 * is correctly implemented by checking the code structure.
 */

const fs = require('fs');
const path = require('path');

console.log('=== UserIndividualMuscleMaxSoreness Migration Verification ===\n');

const startupFilePath = path.join(__dirname, '..', 'api', 'startup.js');
const startupContent = fs.readFileSync(startupFilePath, 'utf8');

const checks = [
    {
        name: 'addIndividualMuscleSorenessTable function exists',
        test: () => startupContent.includes('export const addIndividualMuscleSorenessTable'),
        critical: true
    },
    {
        name: 'Function creates UserIndividualMuscleMaxSoreness table',
        test: () => startupContent.includes('CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness'),
        critical: true
    },
    {
        name: 'Table has user_id column',
        test: () => /UserIndividualMuscleMaxSoreness[\s\S]*?user_id INTEGER NOT NULL/.test(startupContent),
        critical: true
    },
    {
        name: 'Table has muscle_id column',
        test: () => /UserIndividualMuscleMaxSoreness[\s\S]*?muscle_id INTEGER NOT NULL/.test(startupContent),
        critical: true
    },
    {
        name: 'Table has max_soreness column',
        test: () => /UserIndividualMuscleMaxSoreness[\s\S]*?max_soreness REAL NOT NULL/.test(startupContent),
        critical: true
    },
    {
        name: 'Table has composite primary key',
        test: () => /UserIndividualMuscleMaxSoreness[\s\S]*?PRIMARY KEY \(user_id, muscle_id\)/.test(startupContent),
        critical: true
    },
    {
        name: 'Version flag (individualMuscleSorenessTableV1) is defined',
        test: () => startupContent.includes('individualMuscleSorenessTableV1'),
        critical: true
    },
    {
        name: 'Version flag is retrieved from AsyncStorage',
        test: () => startupContent.includes('AsyncStorage.getItem(\'individualMuscleSorenessTableV1\')'),
        critical: true
    },
    {
        name: 'Version flag is set for new users',
        test: () => /if \(isFirstLaunch === null\)[\s\S]*?AsyncStorage\.setItem\('individualMuscleSorenessTableV1', 'true'\)/.test(startupContent),
        critical: true
    },
    {
        name: 'Migration runs for existing users without flag',
        test: () => /if \(!individualMuscleSorenessTableV1\)[\s\S]*?addIndividualMuscleSorenessTable/.test(startupContent),
        critical: true
    },
    {
        name: 'Version flag is set after migration',
        test: () => /addIndividualMuscleSorenessTable[\s\S]*?AsyncStorage\.setItem\('individualMuscleSorenessTableV1', 'true'\)/.test(startupContent),
        critical: true
    },
    {
        name: 'Table is included in dropTables function',
        test: () => /dropTables[\s\S]*?DROP TABLE IF EXISTS UserIndividualMuscleMaxSoreness/.test(startupContent),
        critical: false
    },
    {
        name: 'Table is included in createUserTables function',
        test: () => /createUserTables[\s\S]*?CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness/.test(startupContent),
        critical: true
    }
];

let passed = 0;
let failed = 0;
let criticalFailures = [];

checks.forEach((check, index) => {
    const result = check.test();
    const status = result ? '✓ PASS' : '✗ FAIL';
    const severity = check.critical ? '[CRITICAL]' : '[INFO]';
    
    console.log(`${index + 1}. ${severity} ${check.name}`);
    console.log(`   ${status}\n`);
    
    if (result) {
        passed++;
    } else {
        failed++;
        if (check.critical) {
            criticalFailures.push(check.name);
        }
    }
});

console.log('=== Summary ===');
console.log(`Total Checks: ${checks.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (criticalFailures.length > 0) {
    console.log('\n⚠️  CRITICAL FAILURES:');
    criticalFailures.forEach(failure => {
        console.log(`  - ${failure}`);
    });
    console.log('\nMigration implementation has critical issues!');
    process.exit(1);
} else if (failed > 0) {
    console.log('\n⚠️  Some non-critical checks failed, but migration should work correctly.');
    process.exit(0);
} else {
    console.log('\n✓ All checks passed! Migration is correctly implemented.');
    process.exit(0);
}
