# UserIndividualMuscleMaxSoreness Table Migration

## Overview
This document describes the migration implementation for the `UserIndividualMuscleMaxSoreness` table, which ensures existing users get the table added to their database upon app update.

## Problem Statement
The `UserIndividualMuscleMaxSoreness` table was recently added to the database schema. New users who download the app will have this table created automatically, but existing users who upgrade to this version need a migration mechanism to add the table to their existing database.

## Solution
Following the same pattern used for the `exerciseTablesV2` migration, we implemented:

1. **Migration Function**: `addIndividualMuscleSorenessTable(db)`
   - Creates the `UserIndividualMuscleMaxSoreness` table using `CREATE TABLE IF NOT EXISTS`
   - Safe to run multiple times without causing errors
   - Located in `api/startup.js` before the `initializeDatabase` function

2. **Version Flag**: `individualMuscleSorenessTableV1`
   - Stored in AsyncStorage
   - Prevents the migration from running multiple times
   - Set to `'true'` after successful migration

3. **Migration Logic in initializeDatabase**:
   - For **new users** (first launch):
     - Full database setup runs via `setupDatabase()`
     - Flag is set immediately
   - For **existing users**:
     - Check if flag exists in AsyncStorage
     - If not, run `addIndividualMuscleSorenessTable(db)`
     - Set flag after successful migration
   - Runs independently from other migrations (e.g., `exerciseTablesV2`)

## Implementation Details

### File Modified
- `api/startup.js`

### Changes Made

1. Added `addIndividualMuscleSorenessTable` function:
```javascript
export const addIndividualMuscleSorenessTable = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness (
            user_id INTEGER NOT NULL,
            muscle_id INTEGER NOT NULL,
            max_soreness REAL NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, muscle_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );
    `);
};
```

2. Updated `initializeDatabase` function:
   - Added version flag check: `individualMuscleSorenessTableV1`
   - Restructured logic to handle multiple independent migrations
   - For new users: Sets all version flags
   - For existing users: Checks each flag independently and runs migrations as needed

### Migration Flow

```
App Startup
    ↓
initializeDatabase()
    ↓
Check firstLaunch flag
    ↓
┌─────────────────┴─────────────────┐
│                                   │
New User                      Existing User
│                                   │
setupDatabase()                Check exerciseTablesV2 flag
Set all flags                      ↓
                              If not set: repopulateExerciseTables()
                                   ↓
                              Check individualMuscleSorenessTableV1 flag
                                   ↓
                              If not set: addIndividualMuscleSorenessTable()
```

## Table Schema

The table schema in the migration function matches exactly with the schema in `createUserTables()`:

```sql
CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness (
    user_id INTEGER NOT NULL,
    muscle_id INTEGER NOT NULL,
    max_soreness REAL NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, muscle_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
);
```

## Safety Features

1. **Idempotent**: Uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times
2. **Version Controlled**: AsyncStorage flag prevents duplicate runs
3. **Independent**: Doesn't interfere with other migrations
4. **Non-Breaking**: Existing functionality continues to work
5. **Error Handling**: Wrapped in try-catch in `initializeDatabase`

## Testing

Unit tests have been added in `__tests__/databaseMigration.test.js` to verify:
- Table schema correctness
- Migration flag logic
- Independence from other migrations
- Schema consistency between migration and initial creation

## Usage in Code

The `UserIndividualMuscleMaxSoreness` table is used by:
- `db/user/UserIndividualMuscleMaxSoreness.js`: CRUD operations
- `db/data/MuscleGroupSoreness.js`: Updates max soreness after workouts
- Muscle soreness tracking features throughout the app

## Deployment Checklist

- [x] Migration function created
- [x] Version flag added to AsyncStorage checks
- [x] Logic added to `initializeDatabase`
- [x] Table schema matches original definition
- [x] Unit tests created
- [x] Documentation written
- [ ] Tested on actual device with existing database
- [ ] Verified no errors in production logs after deployment

## Rollback Plan

If issues arise:
1. The table creation is non-destructive
2. Remove the flag from AsyncStorage on problematic devices: `AsyncStorage.removeItem('individualMuscleSorenessTableV1')`
3. The migration will re-run on next app launch
4. Alternatively, remove the table: `DROP TABLE IF EXISTS UserIndividualMuscleMaxSoreness`

## Related Files

- `api/startup.js` - Migration implementation
- `db/user/UserIndividualMuscleMaxSoreness.js` - Table operations
- `db/data/MuscleGroupSoreness.js` - Uses the table
- `__tests__/databaseMigration.test.js` - Tests
