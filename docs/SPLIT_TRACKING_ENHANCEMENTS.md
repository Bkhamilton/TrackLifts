# Split Tracking Enhancements

## Overview

This document outlines the comprehensive plan for enhancing the Split tracking system in TrackLifts to support flexible workout scheduling while maintaining adherence tracking. The current system tracks days within a cycle only when the cycle is followed exactly, but users often need to shuffle workouts within their training split based on recovery, time constraints, and energy levels.

## Problem Statement

### Current Limitations

The existing split tracking system has several inflexible constraints:

1. **Rigid Cycle Progression**: Days within a cycle advance only when following the exact order
2. **No Actual vs. Expected Tracking**: System doesn't distinguish between planned workouts and what was actually completed
3. **Limited Adherence Insights**: No visibility into how well users are sticking to their intended split
4. **Inflexible Rest Day Handling**: Rest days must occur in their scheduled position

### User Scenarios

**Example Split**: Chest Day → Back Day → Arm Day → Leg Day → Shoulders & Core Day → Rest

**Scenario 1: Energy-Based Reordering**
- User completes Chest on Monday
- Feels fully recovered on Tuesday and has arm energy
- Does Arm Day instead of scheduled Back Day
- Does Back Day on Wednesday
- **Current Problem**: System doesn't track this variance

**Scenario 2: Schedule-Based Flexibility**
- User alternates between Chest and Back as first workout
- Sometimes does Chest on Monday, Back on Tuesday
- Other times does Back on Monday, Chest on Tuesday
- Both orderings are valid for the user's goals
- **Current Problem**: System sees this as non-adherent

**Scenario 3: Active Rest Days**
- User plans Rest day for Saturday
- On Thursday, takes an unplanned rest day
- On Saturday, does a scheduled workout
- **Future Enhancement**: With cardio tracking, can log active rest (walking, light bike)

## Proposed Solution

### Overview

Transform the split tracking system to support:

1. **Dual Tracking**: Track both expected (planned) and actual workouts for each day
2. **Flexible Scheduling**: Allow completing cycle workouts in any order
3. **Adherence Metrics**: Calculate and display how well users follow their intended split
4. **Cycle Completion Focus**: Emphasize completing all workouts in a cycle, regardless of order

### Key Principles

1. **Cycle Completeness > Order**: What matters most is completing all workouts in the cycle
2. **Visibility**: Users should see both their plan and their reality
3. **Flexibility Without Judgment**: Support user autonomy in workout scheduling
4. **Gradual Enhancement**: Build on existing system without breaking current functionality

## Split Component Enhancement (Home Page)

### Current Implementation

The home page Split Component shows:
- Horizontal scroll of upcoming cycle days
- Current day highlighted
- Ability to start the scheduled workout
- Option to skip workout (advances cycle day)

**File**: `components/Home/SplitComponent.tsx`

### Proposed Weekly View

Transform the Split Component to show a weekly calendar view:

```
┌─────────────────────────────────────────────┐
│  Your Split - Week of Dec 16                │
├─────────────────────────────────────────────┤
│  Mon 16 │ Tue 17 │ Wed 18 │ Thu 19 │ Fri 20 │
├─────────┼─────────┼─────────┼─────────┼────────┤
│ Expected:│Expected:│Expected:│Expected:│Expected:│
│  Chest  │  Back   │  Arms   │  Legs   │Shoulders│
│         │         │         │         │         │
│ Actual: │ Actual: │ Actual: │ Actual: │ Actual: │
│  Chest  │  Arms   │  Back   │  Rest   │ (today) │
│   ✓     │   ⚠️    │   ⚠️    │   ⚠️    │         │
└─────────┴─────────┴─────────┴─────────┴─────────┘

Cycle Progress: 3/5 workouts completed
Adherence: 33% (1/3 matched expected)
```

### Visual Indicators

- **✓ Green Check**: Actual workout matches expected workout
- **⚠️ Yellow Warning**: Different workout was completed
- **⚠️ Gray Warning**: Rest day when workout was expected
- **Empty**: Future day (no actual workout yet)
- **🏃 Active Rest Icon**: Cardio/active rest performed (future enhancement)

### UI Components

```tsx
interface DayCell {
  date: Date;
  dayOfWeek: string;
  expectedWorkout: string | null;  // null for rest
  actualWorkout: string | null;    // null for rest or not yet completed
  isToday: boolean;
  adherenceStatus: 'match' | 'different' | 'rest' | 'pending';
}

interface WeeklySplitView {
  weekStartDate: Date;
  days: DayCell[];
  cycleProgress: {
    completed: number;
    total: number;
  };
  adherencePercentage: number;
}
```

### Interaction Patterns

1. **Starting Today's Workout**
   - Long press on today's cell
   - Modal appears with options:
     - "Start Expected Workout (Shoulders)"
     - "Start Different Workout"
     - "Mark as Rest Day"

2. **Viewing Past Days**
   - Tap on past day to see details
   - Shows what was planned vs. what was done
   - Option to edit if incorrect

3. **Week Navigation**
   - Swipe left/right to view previous/next weeks
   - "Today" button to jump to current week

## Split Page Enhancement

### Current Implementation

The Split Page (`screens/home/SplitScreen.tsx`) shows:
- Current Split section (horizontal day pills)
- Your Splits section (list of all splits)
- Create/Edit split modals

### Proposed Enhancements

Keep the existing structure but add new sections:

#### 1. Current Split Section (Enhanced)

```
┌─────────────────────────────────────────┐
│  Current Split: Push Pull Legs          │
│  Cycle: Day 3 of 6                      │
├─────────────────────────────────────────┤
│  [Day Pills - Existing UI]              │
│  Day 1 Day 2 Day 3 Day 4 Day 5 Day 6   │
│  Chest Back  Arms  Legs  Shoulders Rest │
└─────────────────────────────────────────┘
```

#### 2. Adherence Overview (New)

```
┌─────────────────────────────────────────┐
│  Split Adherence                        │
├─────────────────────────────────────────┤
│  This Week:        75% adherent         │
│  Last 30 Days:     82% adherent         │
│  All Time:         78% adherent         │
│                                         │
│  Most Consistent:  Chest Day (95%)      │
│  Most Flexible:    Arm Day (60%)        │
│                                         │
│  Cycle Completions: 12 cycles           │
│  Avg Days/Cycle:    6.2 days            │
└─────────────────────────────────────────┘
```

#### 3. Recent Activity (New)

```
┌─────────────────────────────────────────┐
│  Recent Split Activity                  │
├─────────────────────────────────────────┤
│  Today                                  │
│  Expected: Shoulders | Actual: Rest     │
│                                         │
│  Yesterday                              │
│  Expected: Legs | Actual: Legs ✓        │
│                                         │
│  2 Days Ago                             │
│  Expected: Arms | Actual: Chest ⚠️      │
└─────────────────────────────────────────┘
```

#### 4. Your Splits (Existing, Enhanced)

Keep current functionality but add:
- Adherence percentage for each split
- Number of cycles completed
- Last used date

```
┌─────────────────────────────────────────┐
│  Your Splits                            │
├─────────────────────────────────────────┤
│  🌟 Push Pull Legs                      │
│  6 days • 12 cycles • 82% adherence     │
│  Last used: Today                       │
│  [Edit] [Delete]                        │
├─────────────────────────────────────────┤
│  Upper Lower                            │
│  4 days • 3 cycles • 90% adherence      │
│  Last used: 2 weeks ago                 │
│  [Set Active] [Edit] [Delete]           │
└─────────────────────────────────────────┘
```

## Database Schema Changes

### New Tables

#### 1. SplitDayCompletions

Track individual day completions with both expected and actual workouts.

```sql
CREATE TABLE IF NOT EXISTS SplitDayCompletions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    split_id INTEGER NOT NULL,
    completion_date DATE NOT NULL,
    expected_routine_id INTEGER,  -- NULL for rest day
    actual_routine_id INTEGER,    -- NULL for rest day
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (split_id) REFERENCES Splits(id),
    FOREIGN KEY (expected_routine_id) REFERENCES Routines(id),
    FOREIGN KEY (actual_routine_id) REFERENCES Routines(id),
    UNIQUE(user_id, split_id, completion_date)
);

CREATE INDEX idx_split_day_completions_user_split 
    ON SplitDayCompletions(user_id, split_id);

CREATE INDEX idx_split_day_completions_date 
    ON SplitDayCompletions(completion_date);
```

**Purpose**: Track what was planned vs. what actually happened each day

**Key Fields**:
- `completion_date`: The calendar date (e.g., 2024-12-16)
- `expected_routine_id`: What the split schedule called for
- `actual_routine_id`: What was actually performed
- `notes`: Optional user notes about the day

#### 2. SplitCycleCompletions (Replaces SplitCompletions)

Track when a full cycle is completed.

```sql
CREATE TABLE IF NOT EXISTS SplitCycleCompletions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    split_id INTEGER NOT NULL,
    cycle_start_date DATE NOT NULL,
    cycle_end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    adherent_days INTEGER NOT NULL,
    adherence_percentage REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (split_id) REFERENCES Splits(id)
);

CREATE INDEX idx_split_cycle_completions_user_split 
    ON SplitCycleCompletions(user_id, split_id);
```

**Purpose**: Track complete cycle iterations with adherence metrics

**Key Fields**:
- `cycle_start_date`: When the cycle began
- `cycle_end_date`: When all workouts were completed
- `total_days`: Calendar days taken to complete cycle
- `adherent_days`: Days where actual matched expected
- `adherence_percentage`: Calculated adherence score

#### 3. SplitAdherenceStats (View)

```sql
CREATE VIEW IF NOT EXISTS SplitAdherenceStats AS
SELECT
    sdc.user_id,
    sdc.split_id,
    COUNT(*) as total_days,
    SUM(CASE WHEN sdc.expected_routine_id = sdc.actual_routine_id THEN 1 ELSE 0 END) as adherent_days,
    CAST(SUM(CASE WHEN sdc.expected_routine_id = sdc.actual_routine_id THEN 1 ELSE 0 END) AS REAL) / 
        COUNT(*) * 100 as adherence_percentage,
    COUNT(DISTINCT DATE(sdc.completion_date, 'weekday 0', '-6 days')) as weeks_tracked
FROM SplitDayCompletions sdc
GROUP BY sdc.user_id, sdc.split_id;
```

**Purpose**: Provide quick adherence statistics for UI display

### Migration Strategy

#### Phase 1: Additive Changes (Non-Breaking)

1. Create new tables alongside existing ones
2. Modify `completeCurrentSplitDay()` to write to both old and new tables
3. Keep existing `SplitCompletions` table for backward compatibility
4. Add feature flag to enable new tracking

#### Phase 2: Dual Write Period

1. Run both systems in parallel for 2-4 weeks
2. Monitor data consistency
3. Gather user feedback
4. Fix any issues found

#### Phase 3: Migration

1. Copy relevant data from `SplitCompletions` to new tables
2. Update all queries to use new schema
3. Mark old table as deprecated
4. Eventually drop old table in future version

### Backward Compatibility

```typescript
// Helper function to support both old and new systems
async function completeSplitDay(
  db: SQLiteDatabase,
  userId: number,
  splitId: number,
  expectedRoutineId: number | null,
  actualRoutineId: number | null,
  useNewSystem: boolean = true
) {
  // Always write to new system
  if (useNewSystem) {
    await insertSplitDayCompletion(db, {
      user_id: userId,
      split_id: splitId,
      completion_date: new Date().toISOString().split('T')[0],
      expected_routine_id: expectedRoutineId,
      actual_routine_id: actualRoutineId,
    });
  }
  
  // Also write to old system for compatibility
  await insertSplitCompletion(db, {
    user_id: userId,
    split_id: splitId,
    completion_date: new Date().toISOString(),
    completed_cycles: 1,
  });
}
```

## TypeScript Interface Updates

### New Interfaces

```typescript
// New type for daily completion
interface SplitDayCompletion {
  id: number;
  user_id: number;
  split_id: number;
  completion_date: string;  // ISO date string (YYYY-MM-DD)
  expected_routine_id: number | null;
  actual_routine_id: number | null;
  expected_routine_name?: string;  // Joined from Routines
  actual_routine_name?: string;    // Joined from Routines
  notes: string | null;
  created_at: string;
}

// Enhanced cycle completion
interface SplitCycleCompletion {
  id: number;
  user_id: number;
  split_id: number;
  cycle_start_date: string;
  cycle_end_date: string;
  total_days: number;
  adherent_days: number;
  adherence_percentage: number;
  created_at: string;
}

// Adherence statistics
interface SplitAdherenceStats {
  user_id: number;
  split_id: number;
  total_days: number;
  adherent_days: number;
  adherence_percentage: number;
  weeks_tracked: number;
}

// Weekly view data
interface WeeklySplitData {
  weekStartDate: Date;
  weekEndDate: Date;
  days: DayCellData[];
  cycleProgress: CycleProgress;
  adherencePercentage: number;
}

interface DayCellData {
  date: Date;
  dayOfWeek: string;
  dayNumber: number;  // 1-7 for Mon-Sun
  expectedRoutine: {
    id: number | null;
    name: string;
  };
  actualRoutine: {
    id: number | null;
    name: string;
  } | null;
  isToday: boolean;
  isPast: boolean;
  adherenceStatus: 'match' | 'different' | 'missed' | 'extra' | 'pending';
}

interface CycleProgress {
  completedWorkouts: number;
  totalWorkouts: number;  // Number of non-rest days in cycle
  currentDayInCycle: number;
  cycleDays: number;
}
```

### Updated Context Interfaces

```typescript
interface SplitContextValue {
  // Existing
  splits: Splits[];
  activeSplit: Splits | null;
  updateActiveSplit: (splitId: number) => void;
  createSplitInDb: (splitObj: Splits) => Promise<number>;
  updateSplitInDB: (splitObj: Splits) => Promise<void>;
  deleteSplitInDB: (splitId: number) => Promise<void>;
  getCurrentSplitDay: () => Promise<number>;
  getRecommendedRoutine: () => Promise<{ routine: any | null, isRestDay: boolean }>;
  completeCurrentSplitDay: () => Promise<void>;
  isRoutineFavorite: (routineId: number) => Promise<boolean>;
  toggleFavoriteRoutine: (routineId: number) => Promise<void>;
  refreshSplits: () => Promise<void>;
  
  // New methods
  getWeeklySplitData: (weekStartDate: Date) => Promise<WeeklySplitData>;
  completeDayWithRoutine: (
    date: Date,
    expectedRoutineId: number | null,
    actualRoutineId: number | null,
    notes?: string
  ) => Promise<void>;
  getSplitAdherenceStats: (splitId: number, daysBack?: number) => Promise<SplitAdherenceStats>;
  getCurrentCycleProgress: () => Promise<CycleProgress>;
  markDayAsRest: (date: Date) => Promise<void>;
  editPastDay: (
    date: Date,
    actualRoutineId: number | null
  ) => Promise<void>;
}
```

## Implementation Plan

### Phase 1: Database Foundation (Week 1)

**Goal**: Set up new schema without breaking existing functionality

#### Tasks

1. **Create Database Migration**
   - Add `SplitDayCompletions` table
   - Add `SplitCycleCompletions` table
   - Create indexes for performance
   - Create `SplitAdherenceStats` view

2. **Create Database Access Functions**
   ```typescript
   // db/user/SplitDayCompletions.js
   export async function insertSplitDayCompletion(db, completion);
   export async function getSplitDayCompletions(db, userId, splitId, startDate, endDate);
   export async function updateSplitDayCompletion(db, id, updates);
   export async function getDayCompletion(db, userId, splitId, date);
   ```

3. **Update SplitContext**
   - Add new methods alongside existing ones
   - Implement dual-write logic
   - Add feature flag for gradual rollout

4. **Testing**
   - Unit tests for new database functions
   - Integration tests for context methods
   - Verify backward compatibility

**Deliverables**:
- [ ] Migration script in `api/startup.js`
- [ ] Database access functions in `db/user/SplitDayCompletions.js`
- [ ] Updated `contexts/SplitContext.tsx` with new methods
- [ ] Unit tests for new functions

### Phase 2: Core Logic Implementation (Week 2)

**Goal**: Implement tracking logic and adherence calculations

#### Tasks

1. **Implement Adherence Calculation**
   ```typescript
   // utils/splitHelpers.ts
   export function calculateAdherence(
     dayCompletions: SplitDayCompletion[]
   ): SplitAdherenceStats;
   
   export function getDayAdherenceStatus(
     expected: number | null,
     actual: number | null
   ): 'match' | 'different' | 'missed' | 'extra' | 'pending';
   ```

2. **Implement Weekly Data Builder**
   ```typescript
   // utils/splitHelpers.ts
   export async function buildWeeklySplitData(
     db: SQLiteDatabase,
     userId: number,
     splitId: number,
     weekStartDate: Date
   ): Promise<WeeklySplitData>;
   ```

3. **Update Workout Completion Flow**
   - Modify `useHookFinishWorkout` to write to new tables
   - Determine expected routine based on cycle position
   - Record actual routine completed
   - Calculate adherence status

4. **Testing**
   - Test adherence calculation with various scenarios
   - Test weekly data building
   - Test edge cases (missed days, extra workouts, etc.)

**Deliverables**:
- [ ] Adherence calculation utilities
- [ ] Weekly data builder function
- [ ] Updated workout completion hook
- [ ] Comprehensive test suite

### Phase 3: Home Page Split Component (Week 3)

**Goal**: Replace horizontal scroll with weekly calendar view

#### Tasks

1. **Create WeeklySplitView Component**
   ```typescript
   // components/Home/WeeklySplitView.tsx
   interface WeeklySplitViewProps {
     weekData: WeeklySplitData;
     onDayPress: (day: DayCellData) => void;
     onWeekChange: (direction: 'prev' | 'next') => void;
   }
   ```

2. **Create DayCell Component**
   ```typescript
   // components/Home/DayCell.tsx
   interface DayCellProps {
     day: DayCellData;
     onPress: () => void;
   }
   ```

3. **Update SplitComponent**
   - Replace horizontal scroll with weekly view
   - Add week navigation
   - Add today button
   - Maintain existing start workout functionality

4. **Add Workout Selection Modal**
   ```typescript
   // components/modals/SelectWorkoutModal.tsx
   // Modal for choosing which workout to perform
   ```

5. **Testing**
   - Test weekly view rendering
   - Test day cell states (past, today, future)
   - Test adherence indicators
   - Test week navigation

**Deliverables**:
- [ ] WeeklySplitView component
- [ ] DayCell component
- [ ] Updated SplitComponent
- [ ] SelectWorkoutModal component
- [ ] Visual regression tests

### Phase 4: Split Page Enhancements (Week 4)

**Goal**: Add adherence tracking and analytics to Split Page

#### Tasks

1. **Create AdherenceOverview Component**
   ```typescript
   // components/Split/AdherenceOverview.tsx
   interface AdherenceOverviewProps {
     splitId: number;
     stats: SplitAdherenceStats;
   }
   ```

2. **Create RecentActivity Component**
   ```typescript
   // components/Split/RecentActivity.tsx
   interface RecentActivityProps {
     splitId: number;
     recentDays: SplitDayCompletion[];
   }
   ```

3. **Update YourSplits Component**
   - Add adherence percentage to split cards
   - Add cycle count
   - Add last used date

4. **Update SplitScreen**
   - Add new components
   - Wire up data fetching
   - Maintain existing functionality

5. **Testing**
   - Test adherence display
   - Test recent activity list
   - Test split card enhancements
   - Integration tests

**Deliverables**:
- [ ] AdherenceOverview component
- [ ] RecentActivity component  
- [ ] Updated YourSplits component
- [ ] Updated SplitScreen
- [ ] Integration tests

### Phase 5: Polish & Advanced Features (Week 5)

**Goal**: Add nice-to-have features and polish UX

#### Tasks

1. **Add Historical View**
   - View past weeks
   - See adherence trends over time
   - Monthly/yearly summaries

2. **Add Edit Capabilities**
   - Edit past day's actual workout
   - Add notes to days
   - Correct mistakes

3. **Add Insights**
   - Best adherence streaks
   - Most consistent workouts
   - Days of week with best adherence
   - Patterns in workout shuffling

4. **Animations & Transitions**
   - Smooth week transitions
   - Animated adherence indicators
   - Loading states

5. **Testing**
   - User acceptance testing
   - Performance testing
   - Accessibility testing

**Deliverables**:
- [ ] Historical view
- [ ] Edit functionality
- [ ] Insights display
- [ ] Polished animations
- [ ] User testing results

### Phase 6: Future Enhancements (Post-MVP)

**Goal**: Integrate with upcoming features

#### Cardio Integration

When cardiovascular activities are implemented (see `CARDIOVASCULAR_ACTIVITIES.md`):

1. **Active Rest Tracking**
   - Record cardio sessions on rest days
   - Mark as "active rest" vs "complete rest"
   - Show in weekly view with 🏃 icon

2. **Hybrid Workout Days**
   - Support strength + cardio on same day
   - Track both in `SplitDayCompletions`
   - Update UI to show both activities

3. **Enhanced Adherence**
   - Factor in active rest days
   - Distinguish planned rest from unplanned rest
   - Track cardio adherence separately

#### Smart Recommendations

1. **Workout Suggestions**
   - Suggest next workout based on:
     - What's left in current cycle
     - Muscle soreness levels
     - Recent workout history
     - Time available

2. **Recovery-Based Scheduling**
   - Integrate with muscle soreness tracking
   - Recommend workouts for recovered muscle groups
   - Warn against training sore muscles

3. **Adaptive Splits**
   - Learn user's typical workout patterns
   - Suggest split modifications
   - Optimize cycle length based on adherence

## Database Query Examples

### Get Current Week Data

```sql
-- Get all day completions for current week
SELECT 
    sdc.completion_date,
    sdc.expected_routine_id,
    sdc.actual_routine_id,
    er.title as expected_routine_name,
    ar.title as actual_routine_name,
    sdc.notes
FROM SplitDayCompletions sdc
LEFT JOIN Routines er ON sdc.expected_routine_id = er.id
LEFT JOIN Routines ar ON sdc.actual_routine_id = ar.id
WHERE sdc.user_id = ?
    AND sdc.split_id = ?
    AND sdc.completion_date >= DATE('now', 'weekday 0', '-6 days')
    AND sdc.completion_date <= DATE('now', 'weekday 0')
ORDER BY sdc.completion_date ASC;
```

### Calculate Adherence

```sql
-- Calculate adherence for last 30 days
SELECT
    COUNT(*) as total_days,
    SUM(CASE 
        WHEN expected_routine_id = actual_routine_id THEN 1 
        WHEN expected_routine_id IS NULL AND actual_routine_id IS NULL THEN 1
        ELSE 0 
    END) as adherent_days,
    CAST(SUM(CASE 
        WHEN expected_routine_id = actual_routine_id THEN 1 
        WHEN expected_routine_id IS NULL AND actual_routine_id IS NULL THEN 1
        ELSE 0 
    END) AS REAL) / COUNT(*) * 100 as adherence_percentage
FROM SplitDayCompletions
WHERE user_id = ?
    AND split_id = ?
    AND completion_date >= DATE('now', '-30 days')
    AND completion_date <= DATE('now');
```

### Get Cycle Progress

```sql
-- Get current cycle progress
WITH CycleWorkouts AS (
    SELECT 
        sr.routine_id,
        r.title as routine_name
    FROM SplitRoutines sr
    JOIN Routines r ON sr.routine_id = r.id
    WHERE sr.split_id = ?
        AND sr.routine_id IS NOT NULL  -- Exclude rest days
),
CompletedThisCycle AS (
    SELECT DISTINCT actual_routine_id
    FROM SplitDayCompletions
    WHERE user_id = ?
        AND split_id = ?
        AND completion_date >= (
            SELECT MAX(cycle_end_date)
            FROM SplitCycleCompletions
            WHERE user_id = ?
                AND split_id = ?
        )
        AND actual_routine_id IS NOT NULL
)
SELECT
    (SELECT COUNT(*) FROM CompletedThisCycle) as completed_workouts,
    (SELECT COUNT(*) FROM CycleWorkouts) as total_workouts;
```

## Testing Strategy

### Unit Tests

```typescript
describe('Split Adherence Calculations', () => {
  test('calculates 100% adherence when all days match', () => {
    const completions = [
      { expected_routine_id: 1, actual_routine_id: 1 },
      { expected_routine_id: 2, actual_routine_id: 2 },
      { expected_routine_id: null, actual_routine_id: null }, // Rest
    ];
    expect(calculateAdherence(completions)).toBe(100);
  });

  test('calculates 0% adherence when no days match', () => {
    const completions = [
      { expected_routine_id: 1, actual_routine_id: 2 },
      { expected_routine_id: 2, actual_routine_id: 1 },
    ];
    expect(calculateAdherence(completions)).toBe(0);
  });

  test('calculates partial adherence correctly', () => {
    const completions = [
      { expected_routine_id: 1, actual_routine_id: 1 },
      { expected_routine_id: 2, actual_routine_id: 3 },
      { expected_routine_id: 3, actual_routine_id: 3 },
    ];
    expect(calculateAdherence(completions)).toBeCloseTo(66.67, 2);
  });

  test('handles missing days as non-adherent', () => {
    const completions = [
      { expected_routine_id: 1, actual_routine_id: 1 },
      { expected_routine_id: 2, actual_routine_id: null }, // Missed
    ];
    expect(calculateAdherence(completions)).toBe(50);
  });
});

describe('Day Adherence Status', () => {
  test('returns match when expected equals actual', () => {
    expect(getDayAdherenceStatus(1, 1)).toBe('match');
  });

  test('returns different when routines differ', () => {
    expect(getDayAdherenceStatus(1, 2)).toBe('different');
  });

  test('returns missed when expected but no actual', () => {
    expect(getDayAdherenceStatus(1, null)).toBe('missed');
  });

  test('returns extra when no expected but has actual', () => {
    expect(getDayAdherenceStatus(null, 1)).toBe('extra');
  });

  test('returns match for rest days', () => {
    expect(getDayAdherenceStatus(null, null)).toBe('match');
  });

  test('returns pending when actual is undefined', () => {
    expect(getDayAdherenceStatus(1, undefined)).toBe('pending');
  });
});

describe('Weekly Data Builder', () => {
  test('builds 7 days starting from Monday', async () => {
    const weekData = await buildWeeklySplitData(
      db, 
      userId, 
      splitId, 
      new Date('2024-12-16')
    );
    expect(weekData.days).toHaveLength(7);
    expect(weekData.days[0].dayOfWeek).toBe('Mon');
    expect(weekData.days[6].dayOfWeek).toBe('Sun');
  });

  test('marks today correctly', async () => {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekData = await buildWeeklySplitData(db, userId, splitId, weekStart);
    
    const todayCell = weekData.days.find(d => d.isToday);
    expect(todayCell).toBeDefined();
    expect(todayCell.date.toDateString()).toBe(today.toDateString());
  });

  test('includes expected routines based on cycle', async () => {
    const weekData = await buildWeeklySplitData(
      db, 
      userId, 
      splitId, 
      new Date('2024-12-16')
    );
    expect(weekData.days[0].expectedRoutine).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe('Split Completion Flow', () => {
  test('completing workout updates both old and new tables', async () => {
    await completeDayWithRoutine(db, userId, splitId, new Date(), 1, 1);
    
    // Check new table
    const dayCompletion = await getDayCompletion(db, userId, splitId, new Date());
    expect(dayCompletion.actual_routine_id).toBe(1);
    
    // Check old table for compatibility
    const oldCompletion = await getLastSplitCompletion(db, userId, splitId);
    expect(oldCompletion).toBeDefined();
  });

  test('completing cycle increments cycle count', async () => {
    const split = { routines: [/* 5 workout days */] };
    
    // Complete all workouts in cycle
    for (let i = 0; i < 5; i++) {
      await completeDayWithRoutine(db, userId, splitId, addDays(new Date(), i), i, i);
    }
    
    const cycleProgress = await getCurrentCycleProgress(db, userId, splitId);
    expect(cycleProgress.completed_workouts).toBe(5);
    expect(cycleProgress.total_workouts).toBe(5);
    
    // Verify cycle completion recorded
    const cycleCompletions = await getSplitCycleCompletions(db, userId, splitId);
    expect(cycleCompletions.length).toBeGreaterThan(0);
  });
});
```

### UI Tests

```typescript
describe('WeeklySplitView Component', () => {
  test('renders 7 day cells', () => {
    const { getAllByTestId } = render(<WeeklySplitView weekData={mockWeekData} />);
    expect(getAllByTestId('day-cell')).toHaveLength(7);
  });

  test('shows adherence indicators correctly', () => {
    const { getByText } = render(<WeeklySplitView weekData={mockWeekData} />);
    expect(getByText('✓')).toBeInTheDocument(); // Match
    expect(getByText('⚠️')).toBeInTheDocument(); // Different
  });

  test('highlights today', () => {
    const { getByTestId } = render(<WeeklySplitView weekData={mockWeekData} />);
    const todayCell = getByTestId('day-cell-today');
    expect(todayCell).toHaveStyle({ borderColor: '#ff8787' });
  });

  test('navigates to previous week', () => {
    const onWeekChange = jest.fn();
    const { getByTestId } = render(
      <WeeklySplitView weekData={mockWeekData} onWeekChange={onWeekChange} />
    );
    
    fireEvent.press(getByTestId('prev-week-button'));
    expect(onWeekChange).toHaveBeenCalledWith('prev');
  });
});
```

## UI/UX Considerations

### Visual Design

#### Color Coding

- **Green (#4CAF50)**: Adherent day (matched expected)
- **Yellow (#FFC107)**: Different workout performed  
- **Gray (#9E9E9E)**: Rest when workout expected, or vice versa
- **Red Border (#ff8787)**: Today's workout
- **Light Gray**: Future days (pending)

#### Icons

- **✓ Checkmark**: Perfect adherence
- **⚠️ Warning**: Workout variance
- **🏃 Running**: Active rest (future with cardio)
- **💤 Sleep**: Complete rest
- **📅 Calendar**: Week navigation

### Responsive Layout

#### Mobile (Primary)

- Compact weekly view (7 cells, 2 rows each)
- Swipe gestures for week navigation
- Long-press for actions
- Bottom sheet modals for selections

#### Tablet

- Expanded weekly view with more details
- Side panel for adherence stats
- Inline editing capabilities

### Loading States

```tsx
<DayCell
  loading={isPast && !hasData}
  skeleton={true}
/>
```

### Empty States

```tsx
// No active split
<EmptyState
  icon="calendar-blank"
  title="No Active Split"
  message="Create a split to start tracking your workouts"
  action="Create Split"
/>

// First week of new split
<EmptyState
  icon="information"
  title="Start Your Split"
  message="Complete workouts this week to see adherence tracking"
/>
```

### Error States

```tsx
// Failed to load data
<ErrorState
  icon="alert-circle"
  title="Unable to Load Split Data"
  message="Please check your connection and try again"
  action="Retry"
/>
```

## Accessibility

### Screen Reader Support

```tsx
<DayCell
  accessible={true}
  accessibilityLabel={`${dayOfWeek}, ${date.toLocaleDateString()}. 
    Expected: ${expectedWorkout}. 
    Actual: ${actualWorkout || 'Not yet completed'}. 
    ${adherenceStatus === 'match' ? 'Adherent' : 'Not adherent'}.`}
  accessibilityRole="button"
/>
```

### Keyboard Navigation

- Tab through days
- Enter to select/open day
- Arrow keys for week navigation
- Escape to close modals

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum)
- Icons have text labels
- States distinguishable without color alone

## Performance Considerations

### Database Optimization

1. **Indexes**
   - Index on `(user_id, split_id, completion_date)`
   - Index on `completion_date` for date range queries

2. **Query Optimization**
   - Use prepared statements
   - Batch inserts when possible
   - Limit date ranges in queries

3. **Caching**
   ```typescript
   // Cache current week data
   const [weekCache, setWeekCache] = useState<{
     weekStart: Date;
     data: WeeklySplitData;
   } | null>(null);
   
   // Only refetch if week changes
   useEffect(() => {
     const currentWeekStart = getWeekStart(new Date());
     if (!weekCache || !isSameWeek(weekCache.weekStart, currentWeekStart)) {
       fetchWeekData(currentWeekStart);
     }
   }, []);
   ```

### Rendering Optimization

1. **Memoization**
   ```typescript
   const DayCell = React.memo(({ day }: DayCellProps) => {
     // Component implementation
   }, (prev, next) => {
     return prev.day.adherenceStatus === next.day.adherenceStatus
       && prev.day.isToday === next.day.isToday;
   });
   ```

2. **Lazy Loading**
   - Load current week immediately
   - Lazy load previous/next weeks on navigation

3. **Virtual Scrolling**
   - For historical view with many weeks
   - Render only visible weeks

## Migration Path

### Step 1: Feature Flag (Week 1)

```typescript
// contexts/FeatureFlagContext.tsx
interface FeatureFlags {
  enhancedSplitTracking: boolean;
}

// Enable for testing
const flags: FeatureFlags = {
  enhancedSplitTracking: __DEV__, // Only in dev mode initially
};
```

### Step 2: Parallel Systems (Weeks 2-3)

- Both old and new tracking run simultaneously
- Users can opt-in to new UI
- Data written to both systems

### Step 3: Beta Testing (Week 4)

- Enable for subset of users
- Monitor crash reports
- Gather feedback
- Fix critical issues

### Step 4: Gradual Rollout (Week 5)

- 25% of users
- Monitor metrics
- 50% of users
- 75% of users
- 100% rollout

### Step 5: Cleanup (Week 6+)

- Remove feature flags
- Remove old code paths
- Mark old tables for deprecation
- Plan eventual migration away from old tables

## Success Metrics

### Quantitative

1. **User Engagement**
   - Time spent on Split page (+30% target)
   - Workout completion rate (+10% target)
   - Feature adoption rate (>60% target)

2. **Data Quality**
   - Fewer skipped workouts (-20% target)
   - More consistent tracking (+25% target)
   - Increased session length (+15% target)

3. **Performance**
   - Page load time (<500ms)
   - Query execution time (<100ms)
   - Crash-free rate (>99.5%)

### Qualitative

1. **User Feedback**
   - Positive sentiment in reviews
   - Specific praise for flexibility
   - Reduced confusion reports

2. **Support Tickets**
   - Fewer questions about split tracking
   - Reduced bug reports
   - Better understanding of adherence

## Conclusion

This comprehensive enhancement to the Split tracking system addresses the core limitation of rigid cycle tracking while maintaining the benefits of structured training plans. By tracking both expected and actual workouts, users gain:

1. **Flexibility**: Complete workouts in any order that fits their schedule and recovery
2. **Insight**: Understand adherence patterns and training consistency
3. **Motivation**: Visual feedback on progress through cycles
4. **Planning**: Better weekly overview of training plans

The phased implementation ensures backward compatibility while gradually introducing new features. Future integration with cardiovascular activities will further enhance the system's ability to track complete fitness routines including active rest days.

### Key Takeaways

- **Track reality, not just plans**: Distinguishing expected from actual provides valuable insights
- **Cycle completion matters most**: Order is less important than completing all workouts
- **Gradual rollout reduces risk**: Parallel systems and feature flags enable safe deployment
- **Extensible architecture**: Design supports future enhancements (cardio, smart recommendations)
- **User-centric**: Respects user autonomy while providing structure and accountability

## References

- Current Split tracking: `contexts/SplitContext.tsx`
- Split Component: `components/Home/SplitComponent.tsx`
- Split Page: `screens/home/SplitScreen.tsx`
- Database schema: `api/startup.js`
- Completion tracking: `db/user/SplitCompletions.js`
- Cardio integration: `docs/CARDIOVASCULAR_ACTIVITIES.md`
- Workout completion: `hooks/useHookFinishWorkout.ts`
