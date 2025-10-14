# Exercise and Muscle Migration (V3)

This document describes the migration process for updating exercises and muscles in the TrackLifts app.

## Overview

The `migrateToNewExercises()` function updates the exercise and muscle data in the database from the old `Exercises.json` and `Muscles.json` to the new `NewExercises.json` and `NewMuscles.json`.

## Problem Statement

The original `Exercises.json` and `Muscles.json` files contained:
- 54 muscles (with many specific variations like "Long Head Bicep", "Short Head Bicep", etc.)
- 130 exercises

The new data consolidates to:
- 28 muscles (more general categories like "Biceps", "Triceps", etc.)
- 136 exercises (adds 6 new exercises)

However, we need to update this data **without disrupting user workout history**.

## Solution

The migration follows these steps:

### 1. Drop and Recreate Muscles Table

Since the Muscles table doesn't have any direct foreign keys from user workout data (SessionExercises references Exercises, not Muscles), we can safely drop and recreate it:

```javascript
// Drop ExerciseMuscles and Muscles tables
await db.execAsync(`
    DROP TABLE IF EXISTS ExerciseMuscles;
    DROP TABLE IF EXISTS Muscles;
`);

// Recreate Muscles table with new structure
// Populate with NewMuscles.json data
```

### 2. Preserve Exercise IDs

The Exercises table has foreign keys from:
- `SessionExercises` (user workout history)
- `RoutineExercises` (user routines)
- `ExerciseMuscles` (muscle mappings)

Therefore, we **DO NOT** drop the Exercises table. Instead:

```javascript
// For each existing exercise:
// 1. Find matching exercise in NewExercises
// 2. Delete old ExerciseMuscles entries
// 3. Insert new ExerciseMuscles entries
```

### 3. Update Muscle Mappings

For each exercise in the database:
- Find the corresponding exercise in NewExercises.json
- Delete old muscle associations (ExerciseMuscles)
- Add new muscle associations based on NewExercises.json

```javascript
// Delete old muscle mappings
await deleteExerciseMuscleByExerciseId(db, exercise.id);

// Insert new muscle mappings
for (const muscle of newExercise.muscles) {
    await insertExerciseMuscle(db, {
        exerciseId: exercise.id,
        muscleId: muscleId,
        intensity: muscle.value,
    });
}
```

### 4. Add New Exercises

Any exercises in NewExercises.json that don't exist in the database are added:

```javascript
// Check if exercise exists
const existingId = await getExerciseIdByTitleAndEquipment(db, title, equipment);

// If not, add it
if (!existingId) {
    await insertExercise(db, {
        title: exercise.title,
        equipmentId: equipmentId,
        muscleGroupId: muscleGroupId,
    });
    // ... add muscle mappings
}
```

## Data Changes

### Before Migration
- **Muscles**: 54 detailed muscles
  - Example: "Long Head Bicep", "Short Head Bicep", "Brachialis"
- **Exercises**: 130 exercises

### After Migration
- **Muscles**: 28 consolidated muscles
  - Example: "Biceps", "Triceps", "Brachialis", "Forearms"
- **Exercises**: 136 exercises
  - Added: 6 new plate-loaded exercises (Hack Squat, Lever Row, etc.)

## User Impact

### ✅ What is Preserved
- **All workout history** (SessionExercises table remains unchanged)
- **All routine data** (Routines and RoutineExercises remain unchanged)
- **Exercise IDs** (foreign key relationships remain valid)
- **Exercise names and equipment** (no exercises are removed)

### 🔄 What Changes
- **Muscle associations** (exercises now map to new consolidated muscle list)
- **Muscle soreness tracking** (will use new muscle categories)
- **Exercise library** (6 new exercises added)

### 🚫 What is NOT Lost
- No workout history is deleted
- No exercises are removed
- No user data is affected

## Testing

Run the validation script to verify the migration logic:

```bash
node __tests__/validateMigration.js
```

Expected output:
```
✓ Migration will preserve 130 existing exercises
✓ Migration will add 6 new exercises
✓ Migration will update muscle mappings for all exercises
✓ Migration will consolidate from 54 to 28 muscles
✓ User workout history (SessionExercises) will be preserved
```

## Integration

The migration is automatically triggered during app startup for existing users:

```javascript
// In api/startup.js
export const initializeDatabase = async (db) => {
    const exercisesV3NewMuscles = await AsyncStorage.getItem('exercisesV3NewMuscles');
    
    if (!exercisesV3NewMuscles) {
        const { migrateToNewExercises } = await import('@/api/migrateExercises');
        await migrateToNewExercises(db);
        await AsyncStorage.setItem('exercisesV3NewMuscles', 'true');
    }
};
```

For new users, the `setupDatabase()` function uses NewExercises and NewMuscles directly (via updated `sync.js`).

## Files Changed

1. **api/migrateExercises.js** (new)
   - Contains migration logic
   
2. **api/startup.js**
   - Added migration trigger in `initializeDatabase()`
   
3. **api/sync.js**
   - Updated imports to use NewExercises and NewMuscles
   - Updated `syncMuscles()` to use `muscle_group` field
   
4. **__tests__/exerciseMigration.test.js** (new)
   - Tests for migration logic
   
5. **__tests__/validateMigration.js** (new)
   - Validation script for migration
   
6. **docs/MIGRATION_FLOW.md**
   - Updated with V3 migration details

## Troubleshooting

### If migration fails:

1. Check AsyncStorage flag:
   ```javascript
   const flag = await AsyncStorage.getItem('exercisesV3NewMuscles');
   console.log('Migration flag:', flag);
   ```

2. Reset migration flag (will re-run migration):
   ```javascript
   await AsyncStorage.removeItem('exercisesV3NewMuscles');
   ```

3. Check database state:
   ```javascript
   // Count muscles
   const muscleCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Muscles');
   
   // Count exercises
   const exerciseCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Exercises');
   
   // Check for orphaned SessionExercises
   const orphaned = await db.getAllAsync(`
       SELECT se.id, se.exercise_id
       FROM SessionExercises se
       LEFT JOIN Exercises e ON se.exercise_id = e.id
       WHERE e.id IS NULL
   `);
   ```

## References

- Migration pattern follows existing `individualMuscleSorenessTableV1` migration
- See `docs/MIGRATION_FLOW.md` for complete migration flow diagram
- Data files:
  - `data/NewMuscles.json` - New consolidated muscle list
  - `data/NewExercises.json` - Updated exercise list with new muscle mappings
