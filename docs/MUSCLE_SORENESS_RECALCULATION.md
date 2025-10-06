# Muscle Soreness Recalculation

## Overview

This document details the implementation strategy for recalculating muscle group soreness using weighted contributions from individual muscles, as defined in the `MuscleRatio.json` file. The goal is to provide a more accurate representation of muscle group soreness by accounting for the relative importance of each muscle within a muscle group.

## Current Implementation

Currently, muscle group soreness is calculated by summing all soreness scores for muscles within a muscle group:

```sql
CREATE VIEW IF NOT EXISTS MuscleGroupSoreness AS
SELECT
    ws.user_id,
    mg.id AS muscle_group_id,
    mg.name AS muscle_group,
    SUM(
        (ss.weight * ss.reps * em.intensity * 
        (ss.weight / COALESCE(emh.max_one_rep_max, 1)) 
        *
        CASE 
            WHEN (julianday('now') - julianday(ws.start_time)) <= 1 THEN 1.0
            WHEN (julianday('now') - julianday(ws.start_time)) <= 2 THEN 0.8
            WHEN (julianday('now') - julianday(ws.start_time)) <= 3 THEN 0.65
            WHEN (julianday('now') - julianday(ws.start_time)) <= 4 THEN 0.55
            WHEN (julianday('now') - julianday(ws.start_time)) <= 5 THEN 0.45
            WHEN (julianday('now') - julianday(ws.start_time)) <= 7 THEN 0.3
            ELSE 0.1
        END
        )
    ) AS soreness_score
FROM WorkoutSessions ws
...
GROUP BY ws.user_id, mg.name;
```

Individual muscle soreness is also tracked:

```sql
CREATE VIEW IF NOT EXISTS MuscleSoreness AS
SELECT
    ws.user_id,
    mg.id AS muscle_group_id,
    mg.name AS muscle_group,
    m.id AS muscle_id,
    m.name AS muscle_name,
    SUM(...) AS soreness_score
FROM WorkoutSessions ws
...
GROUP BY ws.user_id, mg.id, m.id;
```

## MuscleRatio.json Structure

The `MuscleRatio.json` file defines the relative contribution of each muscle to its parent muscle group. The ratios for all muscles within a muscle group sum to 1.0 (100%).

### Example Structure

```json
[
  {
    "muscle_group": "Chest",
    "muscles": [
      {
        "name": "Chest",
        "ratio": 0.6
      },
      {
        "name": "Upper Chest",
        "ratio": 0.3
      },
      {
        "name": "Lower Chest",
        "ratio": 0.1
      }
    ]
  },
  {
    "muscle_group": "Back",
    "muscles": [
      {
        "name": "Lats",
        "ratio": 0.3
      },
      {
        "name": "Upper Traps",
        "ratio": 0.15
      },
      {
        "name": "Middle Traps",
        "ratio": 0.15
      },
      {
        "name": "Lower Traps",
        "ratio": 0.1
      },
      {
        "name": "Rhomboids",
        "ratio": 0.15
      },
      {
        "name": "Teres",
        "ratio": 0.05
      },
      {
        "name": "Lower Back",
        "ratio": 0.1
      }
    ]
  }
  // ... more muscle groups
]
```

### Current Muscle Groups and Ratios

#### Chest (Total: 1.0)
- Chest: 0.6 (60%)
- Upper Chest: 0.3 (30%)
- Lower Chest: 0.1 (10%)

#### Back (Total: 1.0)
- Lats: 0.3 (30%)
- Upper Traps: 0.15 (15%)
- Middle Traps: 0.15 (15%)
- Lower Traps: 0.1 (10%)
- Rhomboids: 0.15 (15%)
- Teres: 0.05 (5%)
- Lower Back: 0.1 (10%)

#### Shoulders (Total: 1.0)
- Front Delts: 0.35 (35%)
- Side Delts: 0.35 (35%)
- Rear Delts: 0.3 (30%)

#### Arms (Total: 1.0)
- Biceps: 0.35 (35%)
- Triceps: 0.4 (40%)
- Brachialis: 0.15 (15%)
- Forearms: 0.1 (10%)

#### Legs (Total: 1.0)
- Quads: 0.25 (25%)
- Hamstrings: 0.25 (25%)
- Glutes: 0.25 (25%)
- Calves: 0.1 (10%)
- Adductors: 0.07 (7%)
- Abductors: 0.05 (5%)
- Hip Flexors: 0.03 (3%)

#### Core (Total: 1.0)
- Abs: 0.4 (40%)
- Obliques: 0.3 (30%)
- Deep Core: 0.2 (20%)
- Serratus: 0.1 (10%)

## New Weighted Calculation Method

### Concept

To reach 100% soreness for a muscle group, a user must be at 100% soreness for **each** of the muscles that make up that muscle group according to their ratios in `MuscleRatio.json`.

### Formula

The weighted muscle group soreness is calculated as:

```
MuscleGroupSoreness = Σ (IndividualMuscleSoreness × MuscleRatio)
```

Where:
- `IndividualMuscleSoreness` is the soreness score for a specific muscle (normalized to 0-1 scale)
- `MuscleRatio` is the muscle's contribution ratio from `MuscleRatio.json`

### Normalization

Before applying the formula, individual muscle soreness scores need to be normalized to a 0-1 scale (0-100%):

```
NormalizedMuscleSoreness = IndividualMuscleSoreness / MaxMuscleSoreness
```

Where `MaxMuscleSoreness` is the maximum soreness value observed for that muscle (stored in `UserMuscleMaxSoreness` table).

### Implementation Steps

#### Step 1: Normalize Individual Muscle Soreness

For each muscle, calculate the normalized soreness:

```javascript
// Pseudo-code example
const normalizeMuscleSoreness = (muscleSoreness, maxSoreness) => {
  if (maxSoreness === 0) return 0;
  return Math.min(muscleSoreness / maxSoreness, 1.0);
};
```

#### Step 2: Load MuscleRatio.json

Load and parse the muscle ratio configuration:

```javascript
import muscleRatios from '../data/MuscleRatio.json';

// Create a lookup map for easy access
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
```

#### Step 3: Calculate Weighted Muscle Group Soreness

For each muscle group, sum the weighted contributions:

```javascript
const calculateWeightedMuscleGroupSoreness = (muscleGroup, muscles, ratioMap) => {
  let totalSoreness = 0;
  
  muscles.forEach(muscle => {
    const normalizedSoreness = normalizeMuscleSoreness(
      muscle.soreness_score, 
      muscle.max_soreness
    );
    const ratio = ratioMap[muscleGroup]?.[muscle.muscle_name] || 0;
    totalSoreness += normalizedSoreness * ratio;
  });
  
  return totalSoreness;
};
```

### Example Calculation

**Scenario**: Calculating Chest muscle group soreness

**Individual Muscle Soreness:**
- Chest: 800 (max: 1000) → Normalized: 0.8
- Upper Chest: 600 (max: 800) → Normalized: 0.75
- Lower Chest: 400 (max: 500) → Normalized: 0.8

**Calculation:**
```
ChestSoreness = (0.8 × 0.6) + (0.75 × 0.3) + (0.8 × 0.1)
             = 0.48 + 0.225 + 0.08
             = 0.785 (78.5%)
```

**Interpretation**: The chest muscle group is at 78.5% soreness. To reach 100%:
- Main chest needs to be at 100% soreness
- Upper chest needs to be at 100% soreness  
- Lower chest needs to be at 100% soreness

## Implementation Considerations

### Database Changes

#### Option 1: Calculate on Read (Recommended for Initial Implementation)

- Keep existing `MuscleSoreness` and `MuscleGroupSoreness` views as-is
- Load `MuscleRatio.json` in the application layer
- Calculate weighted soreness when displaying to user
- No database schema changes required

**Pros:**
- Minimal changes to existing code
- Easy to iterate and adjust ratios
- No migration needed

**Cons:**
- Calculation happens on every read
- Slightly higher client-side processing

#### Option 2: Database-Stored Ratios

- Create a `MuscleRatios` table to store ratio values
- Modify the `MuscleGroupSoreness` view to join with this table
- Calculate weighted soreness in SQL

**Schema:**
```sql
CREATE TABLE MuscleRatios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    muscle_group_id INTEGER NOT NULL,
    muscle_id INTEGER NOT NULL,
    ratio REAL NOT NULL,
    FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id),
    FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
);
```

**Pros:**
- Calculation happens once in database
- Potentially faster for multiple reads
- Consistent with existing architecture

**Cons:**
- Requires database migration
- More complex initial setup
- Harder to adjust ratios (requires data updates)

### Handling Missing Muscles

If a user has never trained a specific muscle, its soreness will be 0. This is correct behavior:

```javascript
// If a muscle has no soreness data, it contributes 0 to the group
const normalizedSoreness = 0;
const contribution = normalizedSoreness * ratio; // = 0
```

This means the muscle group soreness will be proportionally lower, which accurately reflects incomplete training of the muscle group.

### Handling New Muscles

When adding new muscles to `MuscleRatio.json`:

1. Ensure ratios for the muscle group still sum to 1.0
2. Update the documentation with new ratios
3. Existing soreness calculations will automatically include new muscles as they are trained

### Max Soreness Tracking

The `UserMuscleMaxSoreness` table tracks the maximum soreness ever achieved for each muscle per user:

```javascript
// Update max soreness when calculating current soreness
const updateMaxSoreness = async (db, userId, muscleId, currentSoreness) => {
  const maxSoreness = await getMaxSoreness(db, userId, muscleId);
  
  if (currentSoreness > maxSoreness) {
    await updateUserMuscleMaxSoreness(db, userId, muscleId, currentSoreness);
  }
};
```

## User Interface Considerations

### Displaying Weighted Soreness

When showing muscle group soreness to users:

1. **Muscle Group Level**: Display the weighted percentage (0-100%)
   ```
   Chest: 78.5% sore
   ```

2. **Individual Muscle Breakdown**: Show each muscle's contribution
   ```
   Chest Group (78.5% sore)
   ├─ Chest (60%): 80% sore → contributes 48%
   ├─ Upper Chest (30%): 75% sore → contributes 22.5%
   └─ Lower Chest (10%): 80% sore → contributes 8%
   ```

3. **Visual Indicators**: Use color gradients to show soreness levels
   - 0-25%: Green (recovered)
   - 25-50%: Yellow (mild soreness)
   - 50-75%: Orange (moderate soreness)
   - 75-100%: Red (high soreness)

### Recovery Recommendations

Based on weighted soreness, provide recommendations:

```javascript
const getRecoveryRecommendation = (weightedSoreness) => {
  if (weightedSoreness < 0.25) {
    return "Ready to train - muscle group is well recovered";
  } else if (weightedSoreness < 0.5) {
    return "Light training recommended - some residual soreness";
  } else if (weightedSoreness < 0.75) {
    return "Consider rest or light work - moderate soreness present";
  } else {
    return "Rest recommended - high soreness detected";
  }
};
```

## Testing Strategy

### Unit Tests

1. Test normalization function with various inputs
2. Test weighted calculation with known muscle ratios
3. Test edge cases (zero soreness, missing muscles, etc.)
4. Verify ratio sums equal 1.0 for each muscle group

### Integration Tests

1. Test end-to-end calculation from database query to display
2. Verify max soreness tracking updates correctly
3. Test with multiple users and muscle groups
4. Verify performance with large datasets

### Example Test Cases

```javascript
describe('Weighted Muscle Group Soreness', () => {
  test('calculates correct weighted soreness for chest', () => {
    const muscles = [
      { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 },
      { muscle_name: 'Upper Chest', soreness_score: 600, max_soreness: 800 },
      { muscle_name: 'Lower Chest', soreness_score: 400, max_soreness: 500 }
    ];
    
    const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
    expect(result).toBeCloseTo(0.785, 3);
  });
  
  test('handles missing muscle data gracefully', () => {
    const muscles = [
      { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 }
      // Upper Chest and Lower Chest missing
    ];
    
    const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
    expect(result).toBeCloseTo(0.48, 3); // Only main chest contributes
  });
  
  test('returns 0 for completely untrained muscle group', () => {
    const muscles = [];
    
    const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
    expect(result).toBe(0);
  });
});
```

## Migration Path

### Phase 1: Parallel Implementation (Recommended First Step)

1. Implement weighted calculation alongside existing calculation
2. Display both values in UI for comparison
3. Gather user feedback on accuracy
4. Adjust muscle ratios if needed

### Phase 2: Gradual Rollout

1. Make weighted calculation the default
2. Keep old calculation as fallback
3. Monitor for issues
4. Gradually remove old calculation

### Phase 3: Full Migration

1. Replace all references to old calculation
2. Update documentation
3. Archive old implementation

## Future Enhancements

### Adaptive Ratios

Allow ratios to be adjusted based on user's training style:

```json
{
  "muscle_group": "Chest",
  "default_ratios": {
    "Chest": 0.6,
    "Upper Chest": 0.3,
    "Lower Chest": 0.1
  },
  "powerlifting_ratios": {
    "Chest": 0.7,
    "Upper Chest": 0.2,
    "Lower Chest": 0.1
  },
  "bodybuilding_ratios": {
    "Chest": 0.5,
    "Upper Chest": 0.3,
    "Lower Chest": 0.2
  }
}
```

### Machine Learning Optimization

Track user recovery patterns to optimize ratios over time:

- Learn which muscles recover faster/slower for each user
- Adjust ratios based on training frequency
- Personalize soreness calculations

### Compound Movement Considerations

Account for how compound exercises affect multiple muscle groups:

- Bench press: high chest, moderate front delts, moderate triceps
- Deadlift: high back, high legs, moderate core
- Adjust ratios based on exercise selection

## Conclusion

The weighted muscle soreness calculation using `MuscleRatio.json` provides a more nuanced and accurate representation of muscle group recovery. By accounting for the relative importance of each muscle within a group, users can better understand their recovery status and make informed training decisions.

The implementation should start simple (client-side calculation) and evolve based on user feedback and performance requirements. The modular nature of the design allows for easy iteration and enhancement over time.

## References

- Current implementation: `api/startup.js` (createSorenessViews function)
- Muscle ratios: `data/MuscleRatio.json`
- Max soreness tracking: `db/user/UserMuscleMaxSoreness.js`
- UI display: `components/Profile/MuscleSoreness/`
