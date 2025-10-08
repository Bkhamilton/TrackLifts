# Migration Flow Diagram

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

Action: 
- Run setupDatabase() - creates ALL tables
- Set firstLaunch = 'false'
- Set exerciseTablesV2 = 'true'
- Set individualMuscleSorenessTableV1 = 'true'

Result: ✓ All tables exist, all flags set
```

### Scenario 2: User from Before Exercise Migration
```
firstLaunch = 'false'
exerciseTablesV2 = null  
individualMuscleSorenessTableV1 = null

Action:
- Run repopulateExerciseTables()
- Set exerciseTablesV2 = 'true'
- Run addIndividualMuscleSorenessTable()
- Set individualMuscleSorenessTableV1 = 'true'

Result: ✓ Both migrations run
```

### Scenario 3: User from After Exercise Migration, Before Muscle Soreness Migration
```
firstLaunch = 'false'
exerciseTablesV2 = 'true'  
individualMuscleSorenessTableV1 = null

Action:
- Skip exercise migration (already done)
- Run addIndividualMuscleSorenessTable()
- Set individualMuscleSorenessTableV1 = 'true'

Result: ✓ Only muscle soreness migration runs
```

### Scenario 4: Fully Updated User
```
firstLaunch = 'false'
exerciseTablesV2 = 'true'  
individualMuscleSorenessTableV1 = 'true'

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

## Testing Migrations Locally

To test the migration on your own device:

1. **Test new user flow:**
   ```javascript
   // Clear AsyncStorage before app launch
   await AsyncStorage.clear();
   ```

2. **Test existing user without migration:**
   ```javascript
   // Set user as existing but without migration flag
   await AsyncStorage.setItem('firstLaunch', 'false');
   await AsyncStorage.removeItem('individualMuscleSorenessTableV1');
   ```

3. **Test existing user with migration:**
   ```javascript
   // User already has migration
   await AsyncStorage.setItem('firstLaunch', 'false');
   await AsyncStorage.setItem('individualMuscleSorenessTableV1', 'true');
   ```

4. **Verify table exists:**
   ```javascript
   // Check if table was created
   const result = await db.getFirstAsync(
     "SELECT name FROM sqlite_master WHERE type='table' AND name='UserIndividualMuscleMaxSoreness'"
   );
   console.log('Table exists:', result !== null);
   ```
