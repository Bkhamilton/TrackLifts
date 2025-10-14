# Migration Flow Diagram

## Exercise and Muscle Migration (V3)

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Startup                               │
│                  (App is opened by user)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              initializeDatabase(db)                              │
│         (Called by SQLiteProvider onInit)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │   Get AsyncStorage flags:    │
          │   - firstLaunch              │
          │   - exerciseTablesV2         │
          │   - individualMuscle...V1    │
          │   - exercisesV3NewMuscles    │
          └──────────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  firstLaunch ==   │
              │     null?         │
              └────┬───────┬──────┘
                   │       │
            Yes ───┘       └─── No
             │                  │
             ▼                  ▼
    ┌──────────────┐   ┌──────────────────┐
    │  NEW USER    │   │  EXISTING USER   │
    └──────┬───────┘   └────────┬─────────┘
           │                    │
           ▼                    ▼
    ┌──────────────┐   ┌──────────────────────────────┐
    │ setupDatabase│   │ Check exerciseTablesV2 flag  │
    │    ()        │   └────────┬─────────────────────┘
    │ (Uses New    │            │
    │  Exercises & │     ┌──────┴──────┐
    │  Muscles)    │     │             │
    └──────┬───────┘  No │             │ Yes
           │             ▼             │
           │   ┌─────────────────┐    │
           │   │ repopulateExer- │    │
           │   │  ciseTables()   │    │
           │   └────────┬────────┘    │
           │            │             │
           │            ▼             │
           │   ┌─────────────────┐   │
           │   │Set exerciseTa-  │   │
           │   │blesV2 = true    │   │
           │   └────────┬────────┘   │
           │            │             │
           │            └─────────────┤
           │                          │
           │                          ▼
           │            ┌──────────────────────────────┐
           │            │ Check individualMuscle...V1  │
           │            │          flag                │
           │            └────────┬─────────────────────┘
           │                     │
           │              ┌──────┴──────┐
           │              │             │
           │           No │             │ Yes
           │              ▼             │
           │    ┌─────────────────┐    │
           │    │ addIndividual-  │    │
           │    │MuscleSoreness-  │    │
           │    │   Table()       │    │
           │    └────────┬────────┘    │
           │             │             │
           │             ▼             │
           │    ┌─────────────────┐   │
           │    │Set individual-  │   │
           │    │Muscle...V1=true │   │
           │    └────────┬────────┘   │
           │             │             │
           │             └─────────────┤
           │                           │
           │                           ▼
           │            ┌──────────────────────────────┐
           │            │ Check exercisesV3NewMuscles  │
           │            │          flag                │
           │            └────────┬─────────────────────┘
           │                     │
           │              ┌──────┴──────┐
           │              │             │
           │           No │             │ Yes
           │              ▼             │
           │    ┌─────────────────┐    │
           │    │ migrateToNew-   │    │
           │    │ Exercises()     │    │
           │    │ - Drop/recreate │    │
           │    │   Muscles table │    │
           │    │ - Update Exer-  │    │
           │    │   ciseMuscles   │    │
           │    │ - Add new exer- │    │
           │    │   cises         │    │
           │    └────────┬────────┘    │
           │             │             │
           │             ▼             │
           │    ┌─────────────────┐   │
           │    │Set exercises-   │   │
           │    │V3NewMuscles=true│   │
           │    └────────┬────────┘   │
           │             │             │
           │             └─────────────┤
           │                           │
           ▼                           ▼
    ┌──────────────┐       ┌─────────────────┐
    │ Set all flags│       │   Skip to       │
    │ to 'true':   │       │  completion     │
    │ - firstLaunch│       │                 │
    │ - exercise...│       │                 │
    │ - individual.│       │                 │
    │ - exercisesV3│       │                 │
    └──────┬───────┘       └────────┬────────┘
           │                        │
           └────────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Database Ready      │
            │   App can now use:    │
            │   - All tables        │
            │   - All views         │
            │   - All migrations    │
            │   - New muscles (28)  │
            │   - New exercises     │
            └───────────────────────┘
```

## UserIndividualMuscleMaxSoreness Table Migration

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Startup                               │
│                  (App is opened by user)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              initializeDatabase(db)                              │
│         (Called by SQLiteProvider onInit)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │   Get AsyncStorage flags:    │
          │   - firstLaunch              │
          │   - exerciseTablesV2         │
          │   - individualMuscle...V1    │
          └──────────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  firstLaunch ==   │
              │     null?         │
              └────┬───────┬──────┘
                   │       │
            Yes ───┘       └─── No
             │                  │
             ▼                  ▼
    ┌──────────────┐   ┌──────────────────┐
    │  NEW USER    │   │  EXISTING USER   │
    └──────┬───────┘   └────────┬─────────┘
           │                    │
           ▼                    ▼
    ┌──────────────┐   ┌──────────────────────────────┐
    │ setupDatabase│   │ Check exerciseTablesV2 flag  │
    │    ()        │   └────────┬─────────────────────┘
    └──────┬───────┘            │
           │             ┌──────┴──────┐
           │             │             │
           │          No │             │ Yes
           │             ▼             │
           │   ┌─────────────────┐    │
           │   │ repopulateExer- │    │
           │   │  ciseTables()   │    │
           │   └────────┬────────┘    │
           │            │             │
           │            ▼             │
           │   ┌─────────────────┐   │
           │   │Set exerciseTa-  │   │
           │   │blesV2 = true    │   │
           │   └────────┬────────┘   │
           │            │             │
           │            └─────────────┤
           │                          │
           │                          ▼
           │            ┌──────────────────────────────┐
           │            │ Check individualMuscle...V1  │
           │            │          flag                │
           │            └────────┬─────────────────────┘
           │                     │
           │              ┌──────┴──────┐
           │              │             │
           │           No │             │ Yes
           │              ▼             │
           │    ┌─────────────────┐    │
           │    │ addIndividual-  │    │
           │    │MuscleSoreness-  │    │
           │    │   Table()       │    │
           │    └────────┬────────┘    │
           │             │             │
           │             ▼             │
           │    ┌─────────────────┐   │
           │    │Set individual-  │   │
           │    │Muscle...V1=true │   │
           │    └────────┬────────┘   │
           │             │             │
           │             └─────────────┤
           │                           │
           ▼                           ▼
    ┌──────────────┐       ┌─────────────────┐
    │ Set all flags│       │   Skip to       │
    │ to 'true':   │       │  completion     │
    │ - firstLaunch│       │                 │
    │ - exercise...│       │                 │
    │ - individual.│       │                 │
    └──────┬───────┘       └────────┬────────┘
           │                        │
           └────────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Database Ready      │
            │   App can now use:    │
            │   - All tables        │
            │   - All views         │
            │   - All migrations    │
            └───────────────────────┘
```

## Scenarios

### Scenario 1: Brand New User (First Install)
```
firstLaunch = null
exerciseTablesV2 = null  
individualMuscleSorenessTableV1 = null
exercisesV3NewMuscles = null

Action: 
- Run setupDatabase() - creates ALL tables with NewExercises and NewMuscles
- Set firstLaunch = 'false'
- Set exerciseTablesV2 = 'true'
- Set individualMuscleSorenessTableV1 = 'true'
- Set exercisesV3NewMuscles = 'true'

Result: ✓ All tables exist with new data, all flags set
```

### Scenario 2: User from Before Exercise Migration
```
firstLaunch = 'false'
exerciseTablesV2 = null  
individualMuscleSorenessTableV1 = null
exercisesV3NewMuscles = null

Action:
- Run repopulateExerciseTables()
- Set exerciseTablesV2 = 'true'
- Run addIndividualMuscleSorenessTable()
- Set individualMuscleSorenessTableV1 = 'true'
- Run migrateToNewExercises()
- Set exercisesV3NewMuscles = 'true'

Result: ✓ All migrations run
```

### Scenario 3: User from After Exercise Migration, Before Muscle Soreness Migration
```
firstLaunch = 'false'
exerciseTablesV2 = 'true'  
individualMuscleSorenessTableV1 = null
exercisesV3NewMuscles = null

Action:
- Skip exercise migration (already done)
- Run addIndividualMuscleSorenessTable()
- Set individualMuscleSorenessTableV1 = 'true'
- Run migrateToNewExercises()
- Set exercisesV3NewMuscles = 'true'

Result: ✓ Muscle soreness and new exercises migrations run
```

### Scenario 4: User from After All Migrations, Before New Exercises
```
firstLaunch = 'false'
exerciseTablesV2 = 'true'  
individualMuscleSorenessTableV1 = 'true'
exercisesV3NewMuscles = null

Action:
- Skip previous migrations (already done)
- Run migrateToNewExercises()
- Set exercisesV3NewMuscles = 'true'

Result: ✓ Only new exercises migration runs
```

### Scenario 5: Fully Updated User
```
firstLaunch = 'false'
exerciseTablesV2 = 'true'  
individualMuscleSorenessTableV1 = 'true'
exercisesV3NewMuscles = 'true'

Action:
- Skip all migrations (already done)

Result: ✓ No migrations needed, app starts immediately
```

## Key Points

1. **Independence**: Each migration runs independently based on its own flag
2. **Safety**: Uses `CREATE TABLE IF NOT EXISTS` - won't fail if table exists
3. **Efficiency**: Migrations only run once per user
4. **Clarity**: Clear comments explain each step
5. **Pattern**: Follows established pattern from exerciseTablesV2
6. **History Preservation**: exercisesV3NewMuscles migration preserves user workout history

## New Exercise Migration (V3) Details

The `exercisesV3NewMuscles` migration updates the exercise and muscle data:

### What it does:
1. **Drops and recreates Muscles table** with NewMuscles.json (28 muscles instead of 54)
2. **Preserves Exercise IDs** - critical for maintaining workout history in SessionExercises
3. **Updates ExerciseMuscles mappings** - deletes old muscle associations and adds new ones
4. **Adds new exercises** from NewExercises.json (6 additional exercises)

### Why it's safe:
- **SessionExercises remains intact** - no data loss in workout history
- **Exercise IDs are preserved** - foreign key relationships remain valid
- **Only updates muscle mappings** - doesn't touch user workout data
- **Adds exercises, doesn't remove** - all existing exercises are kept

### Data changes:
- Old: 54 muscles, 130 exercises
- New: 28 muscles, 136 exercises
- Added exercises: Hack Squat, Lever Row, Shoulder Press, Seated Row, Hamstring Curl (all Plate Loaded), and one more

### Technical details:
- Located in: `api/migrateExercises.js`
- Called by: `initializeDatabase()` in `api/startup.js`
- Uses data from: `data/NewMuscles.json` and `data/NewExercises.json`
- Flag: `exercisesV3NewMuscles`

## Testing Migrations Locally

To test the migration on your own device:

1. **Test new user flow:**
   ```javascript
   // Clear AsyncStorage before app launch
   await AsyncStorage.clear();
   ```

2. **Test existing user without V3 migration:**
   ```javascript
   // Set user as existing but without V3 migration flag
   await AsyncStorage.setItem('firstLaunch', 'false');
   await AsyncStorage.setItem('exerciseTablesV2', 'true');
   await AsyncStorage.setItem('individualMuscleSorenessTableV1', 'true');
   await AsyncStorage.removeItem('exercisesV3NewMuscles');
   ```

3. **Test existing user with all migrations:**
   ```javascript
   // User already has all migrations
   await AsyncStorage.setItem('firstLaunch', 'false');
   await AsyncStorage.setItem('exerciseTablesV2', 'true');
   await AsyncStorage.setItem('individualMuscleSorenessTableV1', 'true');
   await AsyncStorage.setItem('exercisesV3NewMuscles', 'true');
   ```

4. **Verify table exists:**
   ```javascript
   // Check if table was created
   const result = await db.getFirstAsync(
     "SELECT name FROM sqlite_master WHERE type='table' AND name='UserIndividualMuscleMaxSoreness'"
   );
   console.log('Table exists:', result !== null);
   ```

5. **Verify new exercises migration:**
   ```javascript
   // Check muscle count (should be 28 after migration)
   const muscleCount = await db.getFirstAsync(
     "SELECT COUNT(*) as count FROM Muscles"
   );
   console.log('Muscle count:', muscleCount.count);
   
   // Check exercise count (should be 136 after migration)
   const exerciseCount = await db.getFirstAsync(
     "SELECT COUNT(*) as count FROM Exercises"
   );
   console.log('Exercise count:', exerciseCount.count);
   
   // Verify workout history is preserved
   const historyCount = await db.getFirstAsync(
     "SELECT COUNT(*) as count FROM SessionExercises"
   );
   console.log('Workout history count:', historyCount.count);
   ```

6. **Run validation script:**
   ```bash
   node __tests__/validateMigration.js
   ```
