# Testing Guide for UserIndividualMuscleMaxSoreness Migration

## Quick Start
This migration adds the `UserIndividualMuscleMaxSoreness` table for existing users. Follow this guide to test the migration before deploying to production.

## Prerequisites
- React Native development environment set up
- Device or emulator with the previous version of the app installed
- Ability to clear app data or AsyncStorage

## Automated Verification (Do This First)

Run the verification script:
```bash
node scripts/verifyMigration.js
```

Expected result: All 13 checks should pass ✓

## Manual Testing Scenarios

### Test 1: New User (First Install)
**Purpose**: Verify new users get the table automatically

**Steps**:
1. Uninstall the app completely from device/emulator
2. Install the new version
3. Open the app for the first time
4. Check database

**Expected Result**:
- App opens without errors
- `UserIndividualMuscleMaxSoreness` table exists
- AsyncStorage has `individualMuscleSorenessTableV1 = 'true'`

**Verification Command** (in your debug console or via Expo):
```javascript
// Check AsyncStorage
const flag = await AsyncStorage.getItem('individualMuscleSorenessTableV1');
console.log('Migration flag:', flag); // Should be 'true'

// Check if table exists
const db = await SQLite.openDatabase('workout-tracker.db');
const result = await db.getFirstAsync(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='UserIndividualMuscleMaxSoreness'"
);
console.log('Table exists:', result !== null); // Should be true
```

---

### Test 2: Existing User (Update from Previous Version)
**Purpose**: Verify existing users get the table added via migration

**Steps**:
1. Install previous version of the app
2. Use the app (create some workouts, profiles, etc.)
3. Close the app
4. Install the new version (upgrade)
5. Open the app

**Expected Result**:
- App opens without errors or crashes
- Migration runs in background
- `UserIndividualMuscleMaxSoreness` table is created
- Existing data is preserved
- AsyncStorage has `individualMuscleSorenessTableV1 = 'true'`

**Verification Command**:
```javascript
// Check if migration ran
const flag = await AsyncStorage.getItem('individualMuscleSorenessTableV1');
console.log('Migration flag:', flag); // Should be 'true'

// Verify table was created
const db = await SQLite.openDatabase('workout-tracker.db');
const result = await db.getFirstAsync(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='UserIndividualMuscleMaxSoreness'"
);
console.log('Table exists:', result !== null); // Should be true

// Verify table schema
const schema = await db.getAllAsync(
  "PRAGMA table_info(UserIndividualMuscleMaxSoreness)"
);
console.log('Table schema:', schema);
// Should show: user_id, muscle_id, max_soreness, last_updated
```

---

### Test 3: Existing User Who Already Has Migration
**Purpose**: Verify migration doesn't run twice

**Steps**:
1. Install the new version
2. Run the app (migration runs)
3. Close and reopen the app multiple times

**Expected Result**:
- No errors on subsequent opens
- Migration doesn't run again
- Performance is normal (no delays)

**Verification**:
- Check logs for "Error initializing database" - should not appear
- App startup should be fast

---

### Test 4: User with Both Migrations Needed
**Purpose**: Verify both migrations run independently

**Steps**:
1. Start with a version that has neither migration
2. Update to the new version
3. Open the app

**Expected Result**:
- Both migrations run
- Both tables exist
- Both flags are set

**Verification Command**:
```javascript
const exerciseFlag = await AsyncStorage.getItem('exerciseTablesV2');
const sorenessFlag = await AsyncStorage.getItem('individualMuscleSorenessTableV1');

console.log('Exercise migration:', exerciseFlag); // Should be 'true'
console.log('Soreness migration:', sorenessFlag); // Should be 'true'
```

---

## Testing the Table Functionality

After verifying the table exists, test that it works correctly:

### Test Table Operations

```javascript
import { 
  updateIndividualMuscleMaxSoreness,
  getIndividualMuscleMaxSoreness,
  getAllIndividualMuscleMaxSoreness
} from '@/db/user/UserIndividualMuscleMaxSoreness';

// Test insert/update
await updateIndividualMuscleMaxSoreness(db, userId, muscleId, 100.5);

// Test retrieve single
const maxSoreness = await getIndividualMuscleMaxSoreness(db, userId, muscleId);
console.log('Max soreness:', maxSoreness); // Should be 100.5

// Test retrieve all
const allSoreness = await getAllIndividualMuscleMaxSoreness(db, userId);
console.log('All soreness:', allSoreness); // Should contain the entry
```

### Test Integration with Workout Flow

1. Complete a workout
2. Check if `UserIndividualMuscleMaxSoreness` gets updated
3. Verify max soreness values are stored correctly

```javascript
// After completing a workout, check the table
const db = await SQLite.openDatabase('workout-tracker.db');
const results = await db.getAllAsync(
  'SELECT * FROM UserIndividualMuscleMaxSoreness WHERE user_id = ?',
  [userId]
);
console.log('Soreness records:', results);
```

---

## Error Scenarios to Test

### Test Error Handling

1. **Network interrupted during migration**:
   - Expected: Migration retries on next launch

2. **Database locked**:
   - Expected: Error logged, app continues safely

3. **Permission denied**:
   - Expected: Error logged, user notified

---

## Performance Testing

### Measure Migration Time

```javascript
// In api/startup.js addIndividualMuscleSorenessTable function
const startTime = Date.now();
await db.execAsync(`...`);
const endTime = Date.now();
console.log(`Migration took ${endTime - startTime}ms`);
```

**Expected**: Migration should complete in < 100ms

---

## Rollback Testing

If you need to test rollback:

```javascript
// Remove the flag to force migration to run again
await AsyncStorage.removeItem('individualMuscleSorenessTableV1');

// Or drop the table to test fresh creation
const db = await SQLite.openDatabase('workout-tracker.db');
await db.execAsync('DROP TABLE IF EXISTS UserIndividualMuscleMaxSoreness');

// Then restart the app
```

---

## Production Monitoring

After deploying to production, monitor:

1. **Sentry Errors**: Check for "Error initializing database"
2. **User Reports**: Check for app crashes on startup
3. **Database Logs**: Verify migration completion
4. **Performance**: Check app startup time hasn't increased significantly

### Key Metrics to Watch

- Error rate during app initialization
- Average startup time
- Success rate of database operations
- User retention (ensure no one's being blocked by migration issues)

---

## Troubleshooting

### Common Issues

1. **Migration doesn't run**:
   - Check AsyncStorage flag: `AsyncStorage.getItem('individualMuscleSorenessTableV1')`
   - Verify `isFirstLaunch` value
   - Check console logs for errors

2. **Table doesn't exist**:
   - Verify migration function was called
   - Check SQL syntax
   - Ensure database has write permissions

3. **Migration runs multiple times**:
   - Verify flag is being set correctly
   - Check flag retrieval logic
   - Ensure flag persists across app restarts

### Debug Commands

```javascript
// Check all migration flags
const flags = {
  firstLaunch: await AsyncStorage.getItem('firstLaunch'),
  exerciseTablesV2: await AsyncStorage.getItem('exerciseTablesV2'),
  individualMuscleSorenessTableV1: await AsyncStorage.getItem('individualMuscleSorenessTableV1')
};
console.log('Migration flags:', flags);

// Check all tables
const db = await SQLite.openDatabase('workout-tracker.db');
const tables = await db.getAllAsync(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
);
console.log('All tables:', tables);

// Check table structure
const schema = await db.getAllAsync(
  "PRAGMA table_info(UserIndividualMuscleMaxSoreness)"
);
console.log('Table schema:', schema);
```

---

## Success Criteria

✅ All automated checks pass (run `node scripts/verifyMigration.js`)
✅ New users get the table automatically
✅ Existing users get the table via migration
✅ Migration runs only once per user
✅ No errors in Sentry logs
✅ App performance is not affected
✅ Existing data is preserved
✅ Table operations work correctly
✅ Integration with workout flow works

---

## Sign-Off

After completing all tests:

- [ ] Automated verification passed
- [ ] New user scenario tested
- [ ] Existing user scenario tested
- [ ] Multiple restart scenario tested
- [ ] Table operations tested
- [ ] Integration with workout flow tested
- [ ] Error handling tested
- [ ] Performance is acceptable
- [ ] No crashes or errors observed
- [ ] Ready for production deployment

**Tester Name**: ________________
**Date**: ________________
**Notes**: ________________
