# Cardiovascular Activities Implementation Plan

## Overview

This document outlines the implementation strategy for adding cardiovascular activities tracking to the TrackLifts application. Active rest days are more beneficial than complete rest days for overall fitness and recovery. By incorporating cardio activities such as treadmill walking (with incline and speed tracking), elliptical, stationary bike, and other aerobic exercises, users will have a more comprehensive view of their fitness journey.

## Motivation

### Why Cardiovascular Activities Matter

1. **Active Recovery**: Low-intensity cardio promotes blood flow to muscles, aiding in recovery without adding significant fatigue
2. **Heart Health**: Cardiovascular exercise improves overall cardiovascular fitness and endurance
3. **Calorie Tracking**: More accurate tracking of total daily energy expenditure
4. **Comprehensive Fitness**: Combines strength and cardiovascular training for holistic fitness tracking
5. **Variety**: Breaks monotony of pure resistance training and provides alternative workout options

### Active Rest Days vs. Rest Days

- **Complete Rest**: No physical activity, muscles recover but cardiovascular system gets no stimulus
- **Active Rest**: Light cardio activity that:
  - Promotes blood circulation for faster muscle recovery
  - Maintains cardiovascular conditioning
  - Burns additional calories without hindering strength gains
  - Reduces stiffness and improves mobility

## Current System Architecture

### Existing Workout Structure

The current system is designed around **resistance training** with the following structure:

```
WorkoutSessions
    └─ SessionExercises (references Exercises table)
        └─ SessionSets (tracks weight, reps, rest time)
```

**Key Tables:**
- `WorkoutSessions`: Tracks workout sessions with start/end time, routine_id, notes, calories_burned
- `SessionExercises`: Links exercises to workout sessions
- `SessionSets`: Tracks individual sets with weight, reps, estimated 1RM, rest time
- `Exercises`: Catalog of exercises with equipment and muscle groups
- `Routines`: Pre-planned workout routines containing multiple exercises

**Key Characteristics:**
- Focused on **sets × reps × weight** paradigm
- Tracks muscle groups and individual muscles targeted
- Calculates 1RM, volume, and muscle soreness
- Designed for discrete exercises with clear start/end points

## Cardiovascular Activities Design

### Core Concept

Cardiovascular activities differ fundamentally from resistance training:

| Aspect | Resistance Training | Cardio Activities |
|--------|-------------------|-------------------|
| Primary Metric | Weight × Reps | Duration × Intensity |
| Tracking Focus | Sets and exercises | Continuous time-based activity |
| Performance | Strength/1RM | Distance, speed, heart rate |
| Recovery Impact | Muscle-specific soreness | General fatigue, cardiovascular stress |
| Equipment | Varied (dumbbells, barbells, machines) | Cardio machines or activities |

### Types of Cardio Activities

1. **Treadmill**
   - Speed (mph or km/h)
   - Incline (%)
   - Duration
   - Distance covered

2. **Elliptical**
   - Resistance level
   - Speed (strides per minute)
   - Duration
   - Distance covered

3. **Stationary Bike**
   - Resistance level
   - Speed (rpm)
   - Duration
   - Distance covered

4. **Rowing Machine**
   - Resistance/damper setting
   - Strokes per minute
   - Duration
   - Distance covered

5. **Stair Climber**
   - Speed (steps per minute)
   - Resistance level
   - Duration
   - Floors climbed

6. **Free-Form Activities**
   - Running/Jogging (outdoor)
   - Cycling (outdoor)
   - Swimming
   - Jump rope
   - HIIT circuits

## Database Schema Changes

### Option 1: Separate Cardio Tables (Recommended)

Create dedicated tables for cardiovascular activities separate from resistance training exercises. This approach maintains clean separation of concerns and allows for activity-specific tracking.

#### New Tables

##### 1. CardioActivityTypes
Catalog of available cardio activities.

```sql
CREATE TABLE IF NOT EXISTS CardioActivityTypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,              -- e.g., 'Treadmill', 'Elliptical', 'Bike'
    description TEXT,                        -- Brief description of the activity
    has_speed BOOLEAN DEFAULT 1,             -- Whether speed tracking is relevant
    has_incline BOOLEAN DEFAULT 0,           -- Whether incline tracking is relevant
    has_resistance BOOLEAN DEFAULT 0,        -- Whether resistance level is relevant
    has_distance BOOLEAN DEFAULT 1,          -- Whether distance tracking is relevant
    has_heart_rate BOOLEAN DEFAULT 1,        -- Whether heart rate tracking is available
    default_met_value REAL,                  -- Default MET value for calorie calculation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Example Data:**
```sql
INSERT INTO CardioActivityTypes (name, has_speed, has_incline, has_resistance, has_distance, default_met_value) VALUES
('Treadmill', 1, 1, 0, 1, 7.0),
('Elliptical', 1, 0, 1, 1, 5.0),
('Stationary Bike', 1, 0, 1, 1, 6.0),
('Rowing Machine', 1, 0, 1, 1, 7.0),
('Stair Climber', 1, 0, 1, 0, 8.0),
('Running', 1, 0, 0, 1, 9.0),
('Cycling', 1, 0, 0, 1, 8.0),
('Swimming', 1, 0, 0, 1, 8.0),
('Jump Rope', 1, 0, 0, 0, 11.0),
('Walking', 1, 1, 0, 1, 3.5);
```

##### 2. CardioSessions
Main table tracking cardio workout sessions.

```sql
CREATE TABLE IF NOT EXISTS CardioSessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type_id INTEGER NOT NULL,       -- References CardioActivityTypes
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes REAL,                   -- Calculated or manual entry
    distance REAL,                           -- In miles or km (user preference)
    distance_unit TEXT DEFAULT 'miles',      -- 'miles' or 'km'
    calories_burned REAL,
    avg_heart_rate INTEGER,                  -- Average heart rate in bpm
    max_heart_rate INTEGER,                  -- Maximum heart rate during session
    notes TEXT,
    is_active_rest BOOLEAN DEFAULT 0,        -- Flag for active rest days
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (activity_type_id) REFERENCES CardioActivityTypes(id)
);
```

##### 3. CardioIntervals
Track intervals or segments within a cardio session (for HIIT, interval training, or machine setting changes).

```sql
CREATE TABLE IF NOT EXISTS CardioIntervals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardio_session_id INTEGER NOT NULL,
    interval_order INTEGER NOT NULL,         -- Order of this interval in the session
    duration_minutes REAL,                   -- Duration of this interval
    speed REAL,                              -- Speed (mph, km/h, rpm, spm depending on activity)
    incline REAL,                            -- Incline percentage (for treadmill)
    resistance_level INTEGER,                -- Resistance level (for bike, elliptical)
    heart_rate INTEGER,                      -- Average heart rate during interval
    distance REAL,                           -- Distance covered in this interval
    notes TEXT,                              -- e.g., "Warm up", "Sprint", "Cool down"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cardio_session_id) REFERENCES CardioSessions(id) ON DELETE CASCADE
);
```

##### 4. CardioMetrics
Track time-series data points during a cardio session (for detailed tracking from wearables or smart machines).

```sql
CREATE TABLE IF NOT EXISTS CardioMetrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardio_session_id INTEGER NOT NULL,
    timestamp DATETIME NOT NULL,             -- Timestamp of this data point
    elapsed_time_seconds INTEGER,            -- Seconds elapsed from start
    speed REAL,                              -- Current speed
    heart_rate INTEGER,                      -- Current heart rate
    distance REAL,                           -- Cumulative distance at this point
    calories REAL,                           -- Cumulative calories at this point
    FOREIGN KEY (cardio_session_id) REFERENCES CardioSessions(id) ON DELETE CASCADE
);
```

##### 5. Combined Workout Sessions
To handle days where users do both resistance training AND cardio, create a linking table.

```sql
CREATE TABLE IF NOT EXISTS CombinedWorkouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_date DATE NOT NULL,
    workout_session_id INTEGER,              -- Can be NULL if only cardio
    cardio_session_id INTEGER,               -- Can be NULL if only resistance
    combined_duration_minutes REAL,
    combined_calories_burned REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (workout_session_id) REFERENCES WorkoutSessions(id),
    FOREIGN KEY (cardio_session_id) REFERENCES CardioSessions(id)
);
```

### Option 2: Unified Activity Table (Alternative)

An alternative approach is to extend the existing `Exercises` table to include cardio activities and modify `SessionSets` to accommodate cardio-specific metrics.

#### Modified Tables

##### Modified: Exercises
```sql
ALTER TABLE Exercises ADD COLUMN activity_type TEXT DEFAULT 'resistance';  
-- 'resistance' or 'cardio'

ALTER TABLE Exercises ADD COLUMN has_intervals BOOLEAN DEFAULT 0;  
-- Whether this activity supports interval tracking
```

##### Modified: SessionSets
```sql
ALTER TABLE SessionSets ADD COLUMN duration_minutes REAL;
ALTER TABLE SessionSets ADD COLUMN speed REAL;
ALTER TABLE SessionSets ADD COLUMN incline REAL;
ALTER TABLE SessionSets ADD COLUMN resistance_level INTEGER;
ALTER TABLE SessionSets ADD COLUMN distance REAL;
ALTER TABLE SessionSets ADD COLUMN heart_rate INTEGER;
ALTER TABLE SessionSets ADD COLUMN is_cardio_interval BOOLEAN DEFAULT 0;
```

**Pros of Option 2:**
- Reuses existing structure
- Minimal changes to UI flow
- Combined history in one place

**Cons of Option 2:**
- Conceptual mismatch (sets/reps don't apply to cardio)
- Many nullable columns
- Potential confusion in queries
- Harder to add cardio-specific features later

### Recommended Approach: **Option 1 (Separate Tables)**

Option 1 is strongly recommended because:

1. **Cleaner Separation**: Cardio and resistance training are fundamentally different
2. **Easier to Extend**: Adding new cardio features won't affect resistance training
3. **Better Performance**: No unused columns, more efficient queries
4. **Clearer Code**: Different code paths for different activity types
5. **Easier Testing**: Can test cardio features independently

## TypeScript Interface Definitions

### New Interfaces

```typescript
// CardioActivityTypes
export interface CardioActivityType {
    id: number;
    name: string;
    description?: string;
    hasSpeed: boolean;
    hasIncline: boolean;
    hasResistance: boolean;
    hasDistance: boolean;
    hasHeartRate: boolean;
    defaultMetValue?: number;
    createdAt: string;
}

// CardioSessions
export interface CardioSession {
    id: number;
    userId: number;
    activityTypeId: number;
    activityTypeName?: string;  // Populated via join
    startTime: string;
    endTime?: string;
    durationMinutes?: number;
    distance?: number;
    distanceUnit: 'miles' | 'km';
    caloriesBurned?: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    notes?: string;
    isActiveRest: boolean;
    intervals?: CardioInterval[];
    createdAt: string;
}

// CardioIntervals
export interface CardioInterval {
    id: number;
    cardioSessionId: number;
    intervalOrder: number;
    durationMinutes?: number;
    speed?: number;
    incline?: number;
    resistanceLevel?: number;
    heartRate?: number;
    distance?: number;
    notes?: string;
    createdAt: string;
}

// CardioMetrics
export interface CardioMetric {
    id: number;
    cardioSessionId: number;
    timestamp: string;
    elapsedTimeSeconds: number;
    speed?: number;
    heartRate?: number;
    distance?: number;
    calories?: number;
}

// CombinedWorkouts
export interface CombinedWorkout {
    id: number;
    userId: number;
    workoutDate: string;
    workoutSessionId?: number;
    cardioSessionId?: number;
    workoutSession?: History;        // Populated via join
    cardioSession?: CardioSession;   // Populated via join
    combinedDurationMinutes?: number;
    combinedCaloriesBurned?: number;
    notes?: string;
    createdAt: string;
}

// Active Cardio Session (for tracking in progress)
export interface ActiveCardioSession {
    activityType: CardioActivityType;
    startTime: string;
    currentInterval: CardioInterval | null;
    intervals: CardioInterval[];
    notes: string;
}
```

## Calorie Calculation

### MET-Based Calculation

Cardiovascular activities use MET (Metabolic Equivalent of Task) values to estimate calorie burn.

**Formula:**
```
Calories = MET × Weight (kg) × Duration (hours)
```

**Implementation:**
```javascript
export function calculateCardioCalories({
    metValue,
    weightLbs,
    durationMinutes
}) {
    const weightKg = weightLbs * 0.453592;
    const durationHours = durationMinutes / 60;
    return metValue * weightKg * durationHours;
}
```

### Dynamic MET Values

MET values vary by intensity. For treadmill walking/running:

```javascript
export function calculateTreadmillMET(speedMph, inclinePercent) {
    // Base MET from speed
    let met = 0;
    
    if (speedMph < 2.0) {
        met = 2.0;  // Very slow walking
    } else if (speedMph < 2.5) {
        met = 2.5;
    } else if (speedMph < 3.0) {
        met = 3.0;
    } else if (speedMph < 3.5) {
        met = 3.3;
    } else if (speedMph < 4.0) {
        met = 3.8;
    } else if (speedMph < 5.0) {
        met = 5.0;  // Brisk walking
    } else if (speedMph < 6.0) {
        met = 8.0;  // Light jogging
    } else if (speedMph < 7.0) {
        met = 9.0;  // Jogging
    } else if (speedMph < 8.0) {
        met = 10.0; // Running
    } else {
        met = 11.0 + (speedMph - 8.0) * 1.5;  // Fast running
    }
    
    // Adjust for incline (each 1% incline adds ~0.5 MET)
    if (inclinePercent > 0) {
        met += inclinePercent * 0.5;
    }
    
    return met;
}
```

### Activity-Specific MET Values

```javascript
const defaultMETValues = {
    'Treadmill': {
        light: 5.0,      // 3-4 mph
        moderate: 7.0,   // 4-5 mph
        vigorous: 9.0    // 5+ mph
    },
    'Elliptical': {
        light: 4.0,
        moderate: 5.0,
        vigorous: 7.0
    },
    'Stationary Bike': {
        light: 5.0,
        moderate: 6.5,
        vigorous: 8.5
    },
    'Rowing Machine': {
        light: 6.0,
        moderate: 7.0,
        vigorous: 9.0
    },
    'Stair Climber': {
        light: 6.0,
        moderate: 8.0,
        vigorous: 10.0
    },
    'Swimming': {
        light: 6.0,
        moderate: 8.0,
        vigorous: 10.0
    }
};
```

## UI/UX Considerations

### Main Navigation

Add a new section for cardio activities:

```
Home
├─ Workout (Resistance Training)
├─ Cardio
│  ├─ Start Cardio Session
│  ├─ Cardio History
│  └─ Activity Types
├─ Profile
├─ Exercises
└─ Routines
```

### Starting a Cardio Session

**Flow:**
1. User selects "Start Cardio Session"
2. Choose activity type (Treadmill, Bike, Elliptical, etc.)
3. Option: Mark as "Active Rest Day"
4. Enter initial settings (speed, incline, resistance)
5. Start timer
6. Option to add intervals during session
7. Complete session with summary

**Screen Mockup Concept:**
```
┌─────────────────────────────┐
│  🏃 Active Cardio Session   │
│  Treadmill                  │
│  ⏱️ 15:32                    │
├─────────────────────────────┤
│                             │
│  Current Interval           │
│  ┌─────────────────────┐   │
│  │ Speed:  5.0 mph     │   │
│  │ Incline: 3.0%       │   │
│  │ Duration: 5:32      │   │
│  │ Distance: 0.46 mi   │   │
│  └─────────────────────┘   │
│                             │
│  📊 Session Stats           │
│  Total Distance: 1.26 mi   │
│  Avg Heart Rate: 142 bpm   │
│  Calories: 165 kcal        │
│                             │
│  [Add Interval]             │
│  [⏸️ Pause] [✅ Complete]   │
└─────────────────────────────┘
```

### Cardio History View

Similar to workout history but adapted for cardio:

```
┌─────────────────────────────┐
│  📅 Cardio History          │
├─────────────────────────────┤
│  Today                      │
│  🏃 Treadmill Walk          │
│  30 min • 2.5 mi • 250 cal │
│  Active Rest Day ✨         │
│                             │
│  Yesterday                  │
│  🚴 Stationary Bike         │
│  45 min • 12 mi • 380 cal  │
│                             │
│  2 Days Ago                 │
│  🏋️ Upper Body Workout      │
│  🏃 Treadmill Run           │
│  25 min • 3.1 mi • 300 cal │
│  Combined Session           │
└─────────────────────────────┘
```

### Combined Workout Days

When a user does both resistance and cardio on the same day:

```
┌─────────────────────────────┐
│  📊 Today's Workout         │
├─────────────────────────────┤
│  💪 Push Day                │
│  60 min • 15,000 lbs total │
│  Bench, Shoulder Press...  │
│                             │
│  🏃 Post-Workout Cardio     │
│  20 min • 1.5 mi • 180 cal │
│  Treadmill                  │
│                             │
│  📈 Total Stats             │
│  Duration: 80 min          │
│  Calories: 480 kcal        │
└─────────────────────────────┘
```

### Activity Type Selection

```
┌─────────────────────────────┐
│  Select Activity Type       │
├─────────────────────────────┤
│  🏃 Treadmill               │
│  🚴 Stationary Bike         │
│  🎯 Elliptical              │
│  🚣 Rowing Machine          │
│  🪜 Stair Climber           │
│  🏊 Swimming                │
│  🏃 Running (Outdoor)       │
│  🚴 Cycling (Outdoor)       │
│  ➕ Custom Activity         │
└─────────────────────────────┘
```

### Interval Training UI

For HIIT or interval-based cardio:

```
┌─────────────────────────────┐
│  ⏱️ Interval 3 of 5          │
│  Sprint                     │
├─────────────────────────────┤
│  ⏳ Time Remaining: 0:47    │
│                             │
│  📊 Current Stats           │
│  Speed: 8.0 mph            │
│  Heart Rate: 168 bpm       │
│                             │
│  Previous Intervals:        │
│  1. Warm up - 5:00         │
│  2. Jog - 2:00             │
│  3. Sprint - 1:13 (active) │
│                             │
│  [Skip to Next] [⏸️ Pause]  │
└─────────────────────────────┘
```

## Integration with Existing Features

### 1. Calendar/History View

Extend the existing workout history to include cardio sessions:

```javascript
// Modified History interface
export interface EnhancedHistory {
    id: number;
    date: string;
    type: 'resistance' | 'cardio' | 'combined';
    workoutSession?: History;      // Existing resistance workout
    cardioSession?: CardioSession; // New cardio session
    combinedStats?: {
        totalDuration: number;
        totalCalories: number;
    };
}
```

### 2. Profile Statistics

Add cardio-specific stats to user profile:

```javascript
export interface EnhancedUserProfileStats extends UserProfileStats {
    // Existing fields...
    totalCardioSessions?: number;
    totalCardioMinutes?: number;
    totalCardioDistance?: number;
    totalCardioCalories?: number;
    favoriteCardioActivity?: string;
    avgCardioHeartRate?: number;
}
```

### 3. Calorie Tracking

Unify calorie tracking across resistance and cardio:

```javascript
export const getTotalCaloriesBurned = async (db, userId) => {
    const resistanceCalories = await getResistanceCalories(db, userId);
    const cardioCalories = await getCardioCalories(db, userId);
    return resistanceCalories + cardioCalories;
};

export const getCardioCalories = async (db, userId) => {
    const query = `
        SELECT SUM(calories_burned) AS totalCalories
        FROM CardioSessions
        WHERE user_id = ?
    `;
    const result = await db.getFirstAsync(query, [userId]);
    return result?.totalCalories || 0;
};
```

### 4. Recovery/Soreness Tracking

Cardiovascular activities have a different impact on muscle soreness:

- **Light Cardio (Active Rest)**: May actually reduce soreness through improved circulation
- **Intense Cardio**: Can add fatigue, especially for leg-intensive activities

**Implementation Idea:**
```javascript
// Adjust muscle soreness based on cardio activity
const cardioSorenessImpact = {
    'Treadmill': {
        'Legs': 0.3,      // Running/walking impacts legs
        'Core': 0.1       // Minimal core engagement
    },
    'Rowing Machine': {
        'Back': 0.4,      // Significant back engagement
        'Arms': 0.2,
        'Legs': 0.3,
        'Core': 0.2
    },
    'Stationary Bike': {
        'Legs': 0.4,      // Heavy leg focus
        'Core': 0.05
    },
    'Elliptical': {
        'Legs': 0.25,     // Lower impact than running
        'Arms': 0.1,      // If using arm handles
        'Core': 0.05
    }
};

// Factor this into soreness calculations
// For active rest (low intensity), use negative values to represent recovery benefit
```

### 5. Workout Recommendations

Integrate cardio into workout planning:

```javascript
const getRecommendation = (muscleSoreness, lastWorkoutType) => {
    if (muscleSoreness > 0.7) {
        return {
            type: 'cardio',
            activity: 'Light cardio for active recovery',
            suggestion: 'Try 20-30 min walking at easy pace'
        };
    } else if (lastWorkoutType === 'resistance') {
        return {
            type: 'cardio',
            activity: 'Moderate cardio',
            suggestion: 'Add 20-30 min of cardio post-workout'
        };
    }
    // ... more logic
};
```

## API/Database Functions

### CardioSessions Functions

```javascript
// db/cardio/CardioSessions.js

export const createCardioSession = async (db, sessionData) => {
    const query = `
        INSERT INTO CardioSessions (
            user_id, activity_type_id, start_time, end_time,
            duration_minutes, distance, distance_unit, calories_burned,
            avg_heart_rate, max_heart_rate, notes, is_active_rest
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // Implementation...
};

export const getCardioSessions = async (db, userId) => {
    const query = `
        SELECT 
            cs.*,
            cat.name AS activityTypeName,
            cat.has_speed AS hasSpeed,
            cat.has_incline AS hasIncline,
            cat.has_resistance AS hasResistance
        FROM CardioSessions cs
        JOIN CardioActivityTypes cat ON cs.activity_type_id = cat.id
        WHERE cs.user_id = ?
        ORDER BY cs.start_time DESC
    `;
    // Implementation...
};

export const updateCardioSession = async (db, sessionId, updates) => {
    // Implementation...
};

export const deleteCardioSession = async (db, sessionId) => {
    // Implementation...
};

export const getCardioSessionById = async (db, sessionId) => {
    // Implementation with intervals joined
};
```

### CardioIntervals Functions

```javascript
// db/cardio/CardioIntervals.js

export const addInterval = async (db, intervalData) => {
    const query = `
        INSERT INTO CardioIntervals (
            cardio_session_id, interval_order, duration_minutes,
            speed, incline, resistance_level, heart_rate, distance, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // Implementation...
};

export const getIntervalsForSession = async (db, cardioSessionId) => {
    const query = `
        SELECT * FROM CardioIntervals
        WHERE cardio_session_id = ?
        ORDER BY interval_order ASC
    `;
    // Implementation...
};

export const updateInterval = async (db, intervalId, updates) => {
    // Implementation...
};

export const deleteInterval = async (db, intervalId) => {
    // Implementation...
};
```

### CardioActivityTypes Functions

```javascript
// db/cardio/CardioActivityTypes.js

export const getActivityTypes = async (db) => {
    const query = `SELECT * FROM CardioActivityTypes ORDER BY name ASC`;
    // Implementation...
};

export const getActivityTypeById = async (db, activityTypeId) => {
    // Implementation...
};

export const createActivityType = async (db, activityData) => {
    // For custom activity types
    // Implementation...
};
```

### Statistics Functions

```javascript
// db/cardio/CardioStats.js

export const getCardioStatistics = async (db, userId) => {
    const query = `
        SELECT 
            COUNT(*) AS totalSessions,
            SUM(duration_minutes) AS totalMinutes,
            SUM(distance) AS totalDistance,
            SUM(calories_burned) AS totalCalories,
            AVG(avg_heart_rate) AS overallAvgHeartRate,
            MAX(distance) AS longestDistance,
            MAX(duration_minutes) AS longestDuration
        FROM CardioSessions
        WHERE user_id = ?
    `;
    // Implementation...
};

export const getCardioByActivityType = async (db, userId) => {
    const query = `
        SELECT 
            cat.name AS activityType,
            COUNT(*) AS sessionCount,
            SUM(cs.duration_minutes) AS totalMinutes,
            SUM(cs.distance) AS totalDistance,
            SUM(cs.calories_burned) AS totalCalories
        FROM CardioSessions cs
        JOIN CardioActivityTypes cat ON cs.activity_type_id = cat.id
        WHERE cs.user_id = ?
        GROUP BY cat.name
        ORDER BY sessionCount DESC
    `;
    // Implementation...
};

export const getWeeklyCardioSummary = async (db, userId) => {
    const query = `
        SELECT 
            DATE(start_time) AS date,
            COUNT(*) AS sessions,
            SUM(duration_minutes) AS totalMinutes,
            SUM(calories_burned) AS totalCalories
        FROM CardioSessions
        WHERE user_id = ? 
          AND start_time >= datetime('now', '-7 days')
        GROUP BY DATE(start_time)
        ORDER BY date DESC
    `;
    // Implementation...
};
```

## Migration Strategy

### Phase 1: Database Setup
1. Create new tables (CardioActivityTypes, CardioSessions, CardioIntervals, CardioMetrics, CombinedWorkouts)
2. Populate CardioActivityTypes with default activities
3. Test table creation and relationships
4. Add database access functions

### Phase 2: Basic Cardio Tracking
1. Create simple UI for starting a cardio session
2. Implement basic timer and data entry
3. Save cardio session to database
4. Display cardio history
5. Calculate and display calories burned

### Phase 3: Advanced Features
1. Add interval support
2. Implement real-time metrics tracking
3. Add heart rate monitoring integration
4. Create activity-specific input screens (treadmill settings, bike settings, etc.)

### Phase 4: Integration
1. Combine cardio and resistance workouts in history view
2. Add cardio stats to profile
3. Update calendar to show combined activities
4. Implement workout recommendations based on cardio/resistance balance

### Phase 5: Polish
1. Add graphs and charts for cardio progress
2. Create challenges and goals for cardio activities
3. Add activity presets (favorite cardio routines)
4. Implement social features (share cardio achievements)

## Testing Strategy

### Unit Tests

1. **Calorie Calculations**
   ```javascript
   test('calculates treadmill calories correctly', () => {
       const result = calculateCardioCalories({
           metValue: 7.0,
           weightLbs: 180,
           durationMinutes: 30
       });
       expect(result).toBeCloseTo(286.5, 1);
   });
   ```

2. **MET Value Calculations**
   ```javascript
   test('calculates treadmill MET with incline', () => {
       const met = calculateTreadmillMET(4.0, 5.0); // 4 mph, 5% incline
       expect(met).toBeCloseTo(6.3, 1);
   });
   ```

3. **Database Operations**
   ```javascript
   test('creates and retrieves cardio session', async () => {
       const session = await createCardioSession(db, {
           userId: 1,
           activityTypeId: 1,
           durationMinutes: 30,
           // ... more data
       });
       const retrieved = await getCardioSessionById(db, session.id);
       expect(retrieved.durationMinutes).toBe(30);
   });
   ```

### Integration Tests

1. Test complete cardio session flow (start → add intervals → complete)
2. Test combined workout creation (resistance + cardio same day)
3. Test statistics calculations across multiple sessions
4. Test data migration and backwards compatibility

### User Acceptance Testing

1. Complete a full cardio session on each activity type
2. Verify calorie calculations match expectations
3. Test interval training flow
4. Verify combined workout displays correctly
5. Check that statistics update properly

## Data Migration

### For Existing Users

No data migration needed as this is a new feature. However:

1. **Initialize Activity Types**: Pre-populate CardioActivityTypes table on app update
2. **User Preferences**: Add cardio-related preferences (distance unit preference, default activities)
3. **Backwards Compatibility**: Ensure existing workout history remains unaffected

### Database Version Update

```javascript
// In api/startup.js or migration file
export const migrateToCardioSupport = async (db) => {
    const currentVersion = await getDatabaseVersion(db);
    
    if (currentVersion < CARDIO_VERSION) {
        // Create new tables
        await createCardioTables(db);
        await populateDefaultActivityTypes(db);
        
        // Update version
        await updateDatabaseVersion(db, CARDIO_VERSION);
    }
};
```

## Performance Considerations

### Database Indexing

```sql
-- Optimize common queries
CREATE INDEX IF NOT EXISTS idx_cardio_sessions_user_id 
    ON CardioSessions(user_id);

CREATE INDEX IF NOT EXISTS idx_cardio_sessions_start_time 
    ON CardioSessions(start_time);

CREATE INDEX IF NOT EXISTS idx_cardio_sessions_user_date 
    ON CardioSessions(user_id, start_time);

CREATE INDEX IF NOT EXISTS idx_cardio_intervals_session_id 
    ON CardioIntervals(cardio_session_id);

CREATE INDEX IF NOT EXISTS idx_cardio_intervals_order 
    ON CardioIntervals(cardio_session_id, interval_order);
```

### Query Optimization

1. **Lazy Load Intervals**: Don't fetch intervals unless viewing session details
2. **Paginate History**: Load cardio history in chunks
3. **Cache Statistics**: Calculate and cache weekly/monthly stats
4. **Batch Updates**: When tracking real-time metrics, batch inserts

### Storage Considerations

- **CardioMetrics**: Can grow large with time-series data
- **Solution**: Implement data retention policy (keep detailed metrics for 30 days, aggregate older data)
- **Cleanup Query**:
  ```sql
  DELETE FROM CardioMetrics 
  WHERE cardio_session_id IN (
      SELECT id FROM CardioSessions 
      WHERE start_time < datetime('now', '-30 days')
  );
  ```

## Future Enhancements

### 1. Wearable Device Integration
- Sync data from Apple Watch, Fitbit, Garmin
- Import heart rate, GPS routes, elevation
- Automatic activity detection

### 2. GPS Tracking
- For outdoor running/cycling
- Record routes and elevation changes
- Display maps of completed routes

### 3. Cardio Programs
- Pre-built cardio programs (Couch to 5K, etc.)
- HIIT workout templates
- Progressive interval training plans

### 4. Social Features
- Share cardio achievements
- Compete with friends on distance/time
- Group challenges

### 5. Advanced Analytics
- VO2 Max estimation
- Training load tracking
- Recovery time recommendations
- Heart rate zone analysis

### 6. Machine Learning
- Predict optimal cardio duration based on goals
- Recommend activities based on preferences
- Estimate calories more accurately based on user history

## Conclusion

Adding cardiovascular activity tracking will significantly enhance the TrackLifts application by providing a complete fitness tracking solution. The recommended approach uses separate database tables for cardio activities, maintaining clean separation from resistance training while allowing for seamless integration in the user experience.

### Key Takeaways

1. **Separate but Integrated**: Keep cardio and resistance training data separate in the database but present a unified experience to users
2. **Flexibility**: Support various cardio activities with activity-specific tracking capabilities
3. **Scalability**: Design supports future enhancements like wearable integration and GPS tracking
4. **Active Recovery**: Emphasize the benefits of active rest days over complete rest
5. **Comprehensive Tracking**: Combine resistance and cardio tracking for holistic fitness insights

### Implementation Priority

1. **High Priority (MVP)**:
   - Basic cardio session tracking
   - Timer and duration tracking
   - Simple interval support
   - Calorie calculation
   - History display

2. **Medium Priority**:
   - Activity-specific settings (speed, incline, resistance)
   - Combined workout views
   - Enhanced statistics
   - Heart rate tracking

3. **Low Priority (Future)**:
   - GPS tracking
   - Wearable integration
   - Advanced programs
   - Social features

This plan provides a solid foundation for implementing cardiovascular activities while maintaining the existing strength training features that make TrackLifts valuable to users.
