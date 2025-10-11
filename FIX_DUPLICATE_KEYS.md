# Fix: Duplicate Key Error in Workout Saving

## Problem
React was throwing the following error when saving workouts to the database:
```
ERROR Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 4
```

## Root Cause
The error was caused by using `set.id` and `exercise.id` as React keys when rendering lists of exercises and sets. These IDs could be non-unique in the following scenarios:

1. **Rapid set additions**: When users quickly added multiple sets, all would receive the same `Date.now()` timestamp as their ID
2. **Database ID collisions**: Set IDs from the database are only unique within the ExerciseSets table, not globally across all sets being rendered
3. **Duplicate exercises**: The same exercise could appear multiple times in a routine, leading to duplicate keys

## Solution
Changed React keys from using database/generated IDs to using array indices. This is safe because:

- Lists are static during rendering (no reordering within a render cycle)
- Items are not dynamically inserted/removed during the render
- The order is meaningful and stable
- Matches the pattern already used correctly in `WorkoutInfo.tsx`

## Files Changed

### 1. `components/modals/RoutineModal/ExerciseHeader.tsx`
- **Before**: `<View key={set.id}>`
- **After**: `<View key={idx}>`

### 2. `components/Workout/NewWorkout/WorkoutDisplay.tsx`
- **Before**: `<View key={set.id}>`
- **After**: `<View key={idx}>`

### 3. `components/modals/HistoryModal/ExerciseCard.tsx`
- **Before**: `<View key={set.id}>`
- **After**: `<View key={index}>`

### 4. `components/modals/RoutineModal/RoutineModal.tsx`
- **Before**: `<ExerciseHeader key={exercise.id}>`
- **After**: `<ExerciseHeader key={idx}>`

## Verification
- ✅ All changed files pass ESLint with no new warnings or errors
- ✅ Changes follow existing patterns in the codebase (e.g., `WorkoutInfo.tsx`)
- ✅ No functional behavior changed - only React key props updated

## Notes
Using indices as keys is appropriate here because:
1. The order of items is meaningful (set order, exercise order)
2. Items are not reordered by user interaction during rendering
3. The lists are stable - changes only happen through explicit add/remove actions that trigger full re-renders
4. React's reconciliation doesn't need to track individual items across renders in these components
