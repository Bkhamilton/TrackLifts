# Routine Muscle Soreness Integration

## Overview

This document outlines the plan to integrate Muscle Soreness calculations and visualizations into routine modals. When a user presses on a routine modal, a small version of the Muscle Soreness diagram will appear, showing which muscle groups and specific muscles are being targeted by the given routine. This provides users with immediate visual feedback about muscle engagement before starting a workout.

## Feature Goals

### Primary Objectives

1. **Visual Muscle Preview**: Display a miniature version of the Muscle Soreness diagram in the routine modal
2. **Muscle Group Breakdown**: Show a list of muscle groups and specific muscles worked by the routine
3. **Intensity Indicators**: Indicate the relative intensity/focus for each muscle group based on the exercises
4. **Pre-workout Insight**: Help users understand what muscles they'll be working before starting the routine

### User Benefits

- **Better Workout Planning**: Users can see at a glance which muscles a routine targets
- **Informed Decisions**: Choose routines based on which muscles need work or recovery
- **Visual Learning**: Understand anatomy and muscle engagement through visual feedback
- **Workout Balance**: Identify if routines are balanced across muscle groups

## Current System Architecture

### Existing Components

#### 1. Routine Modal (`components/modals/RoutineModal/RoutineModal.tsx`)

Currently displays:
- Routine title
- Total exercises and sets count
- List of exercises with headers
- Start workout button
- Favorite toggle

**Key Data Structure:**
```typescript
interface ActiveRoutine {
    id: number;
    title: string;
    exercises: Array<{
        id: number;
        exercise_id?: number;
        title: string;
        equipment: string;
        muscleGroup: string;
        sets: Array<{ /* set data */ }>;
    }>;
}
```

#### 2. Muscle Soreness Components

Located in `components/Profile/MuscleSoreness/`:
- **MuscleSoreness.tsx**: Main component with SVG muscle diagram
- **MuscleInfoPanel.tsx**: Side panel showing muscle details
- **MuscleInfoModal.tsx**: Detailed modal for individual muscles
- **MuscleLabels.tsx**: Interactive muscle group labels
- **SorenessLegend.tsx**: Color legend for soreness levels

#### 3. Database Tables

**ExerciseMuscles Table:**
```sql
CREATE TABLE ExerciseMuscles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER,
    muscle_id INTEGER,
    intensity REAL NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES Exercises(id),
    FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
);
```

**Muscles Table:**
```sql
CREATE TABLE Muscles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    muscle_group_id INTEGER,
    FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id)
);
```

**MuscleGroups Table:**
```sql
CREATE TABLE MuscleGroups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
```

#### 4. Muscle Ratio Data

Located at `data/MuscleRatio.json`:
- Defines muscle contribution ratios within each muscle group
- Used for weighted soreness calculations
- Format:
```json
{
  "muscle_group": "Chest",
  "muscles": [
    { "name": "Chest", "ratio": 0.6 },
    { "name": "Upper Chest", "ratio": 0.3 },
    { "name": "Lower Chest", "ratio": 0.1 }
  ]
}
```

## Proposed Implementation

### Phase 1: Database Query Layer

#### New Database Functions

Create new file: `db/data/RoutineMuscleBreakdown.js`

```javascript
/**
 * Get all muscles worked by a routine with intensity scores
 * @param {object} db - The database instance
 * @param {number} routineId - The routine ID
 * @returns {Promise<Array>} Array of muscles with intensity data
 */
export const getRoutineMuscleBreakdown = async (db, routineId) => {
    try {
        const query = `
            SELECT 
                m.id AS muscle_id,
                m.name AS muscle_name,
                mg.id AS muscle_group_id,
                mg.name AS muscle_group_name,
                AVG(em.intensity) AS avg_intensity,
                COUNT(DISTINCT e.id) AS exercise_count,
                GROUP_CONCAT(DISTINCT e.title, ', ') AS exercises
            FROM RoutineExercises re
            JOIN Exercises e ON re.exercise_id = e.id
            JOIN ExerciseMuscles em ON e.id = em.exercise_id
            JOIN Muscles m ON em.muscle_id = m.id
            JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
            WHERE re.routine_id = ?
            GROUP BY m.id, mg.id
            ORDER BY mg.name, m.name
        `;
        
        const rows = await db.getAllAsync(query, [routineId]);
        return rows;
    } catch (error) {
        console.error('Error fetching routine muscle breakdown:', error);
        throw error;
    }
};

/**
 * Get muscle group summary for a routine
 * @param {object} db - The database instance
 * @param {number} routineId - The routine ID
 * @returns {Promise<Array>} Array of muscle groups with aggregate data
 */
export const getRoutineMuscleGroupSummary = async (db, routineId) => {
    try {
        const query = `
            SELECT 
                mg.id AS muscle_group_id,
                mg.name AS muscle_group_name,
                AVG(em.intensity) AS avg_intensity,
                SUM(em.intensity) AS total_intensity,
                COUNT(DISTINCT e.id) AS exercise_count,
                COUNT(DISTINCT m.id) AS muscle_count
            FROM RoutineExercises re
            JOIN Exercises e ON re.exercise_id = e.id
            JOIN ExerciseMuscles em ON e.id = em.exercise_id
            JOIN Muscles m ON em.muscle_id = m.id
            JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
            WHERE re.routine_id = ?
            GROUP BY mg.id
            ORDER BY total_intensity DESC
        `;
        
        const rows = await db.getAllAsync(query, [routineId]);
        return rows;
    } catch (error) {
        console.error('Error fetching routine muscle group summary:', error);
        throw error;
    }
};

/**
 * Get exercises grouped by muscle for a routine
 * @param {object} db - The database instance
 * @param {number} routineId - The routine ID
 * @param {number} muscleId - Optional muscle ID to filter by
 * @returns {Promise<Array>} Array of exercises targeting the muscle(s)
 */
export const getRoutineExercisesByMuscle = async (db, routineId, muscleId = null) => {
    try {
        const query = `
            SELECT 
                e.id AS exercise_id,
                e.title AS exercise_name,
                eq.name AS equipment,
                m.name AS muscle_name,
                mg.name AS muscle_group_name,
                em.intensity
            FROM RoutineExercises re
            JOIN Exercises e ON re.exercise_id = e.id
            JOIN ExerciseMuscles em ON e.id = em.exercise_id
            JOIN Muscles m ON em.muscle_id = m.id
            JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
            LEFT JOIN Equipment eq ON e.equipment_id = eq.id
            WHERE re.routine_id = ?
            ${muscleId ? 'AND m.id = ?' : ''}
            ORDER BY mg.name, m.name, em.intensity DESC
        `;
        
        const params = muscleId ? [routineId, muscleId] : [routineId];
        const rows = await db.getAllAsync(query, params);
        return rows;
    } catch (error) {
        console.error('Error fetching routine exercises by muscle:', error);
        throw error;
    }
};
```

#### Context Integration

Add methods to `contexts/DataContext.tsx`:

```typescript
const getRoutineMuscleBreakdown = async (routineId: number) => {
    if (db) {
        const data = await getRoutineMuscleBreakdownDB(db, routineId);
        return data;
    }
    return [];
};

const getRoutineMuscleGroupSummary = async (routineId: number) => {
    if (db) {
        const data = await getRoutineMuscleGroupSummaryDB(db, routineId);
        return data;
    }
    return [];
};
```

### Phase 2: UI Components

#### New Component: RoutineMuscleDiagram

Create new file: `components/modals/RoutineModal/RoutineMuscleDiagram.tsx`

This component will be a simplified version of the existing Muscle Soreness diagram, adapted for routine preview.

```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/components/Themed';

interface MusclGroupData {
    muscle_group_id: number;
    muscle_group_name: string;
    avg_intensity: number;
    total_intensity: number;
    exercise_count: number;
}

interface RoutineMuscleDiagramProps {
    muscleGroups: MusclGroupData[];
    view: 'front' | 'back';
}

export default function RoutineMuscleDiagram({ 
    muscleGroups, 
    view 
}: RoutineMuscleDiagramProps) {
    
    // Get color based on intensity (0-1 scale)
    const getIntensityColor = (intensity: number) => {
        if (intensity === 0) return '#e0e0e0';
        if (intensity < 0.3) return '#90EE90'; // Light green
        if (intensity < 0.6) return '#FFD700'; // Gold
        if (intensity < 0.8) return '#FFA500'; // Orange
        return '#FF6B6B'; // Red
    };
    
    // Map muscle group name to ID for color lookup
    const getColorForMuscleGroup = (groupId: string) => {
        const group = muscleGroups.find(
            mg => mg.muscle_group_name.toLowerCase() === groupId.toLowerCase()
        );
        return group ? getIntensityColor(group.avg_intensity) : '#e0e0e0';
    };
    
    // Simplified muscle paths (scaled down from main diagram)
    const musclePaths = {
        front: {
            chest: "M140,80 C130,85 125,95 125,105 C125,120 135,130 160,130 C185,130 195,120 195,105 C195,95 190,85 180,80 Z",
            shoulders: "M110,70 C105,75 100,85 100,95 L115,100 L125,80 Z M210,70 C215,75 220,85 220,95 L205,100 L195,80 Z",
            arms: "M90,95 C85,110 80,130 80,150 L95,145 L100,100 Z M230,95 C235,110 240,130 240,150 L225,145 L220,100 Z",
            core: "M135,135 L135,180 L185,180 L185,135 Z",
            legs: "M140,185 C135,210 130,250 145,270 L155,250 L155,190 Z M180,185 C185,210 190,250 175,270 L165,250 L165,190 Z"
        },
        back: {
            back: "M140,75 L140,140 L180,140 L180,75 C180,70 175,65 160,65 C145,65 140,70 140,75 Z",
            shoulders: "M115,70 C110,75 105,85 105,95 L120,100 L130,80 Z M205,70 C210,75 215,85 215,95 L200,100 L190,80 Z",
            arms: "M95,95 C90,110 85,130 85,150 L100,145 L105,100 Z M225,95 C230,110 235,130 235,150 L220,145 L215,100 Z",
            core: "M140,145 L140,180 L180,180 L180,145 Z",
            legs: "M145,185 C140,210 135,250 150,270 L160,250 L160,190 Z M175,185 C180,210 185,250 170,270 L160,250 L160,190 Z"
        }
    };
    
    const currentPaths = musclePaths[view];
    
    return (
        <View style={styles.container}>
            <Svg height="300" width="320" viewBox="0 0 320 300">
                {Object.entries(currentPaths).map(([muscleGroup, path]) => (
                    <Path
                        key={muscleGroup}
                        d={path}
                        fill={getColorForMuscleGroup(muscleGroup)}
                        stroke="#333"
                        strokeWidth="1.5"
                    />
                ))}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});
```

#### New Component: RoutineMuscleBreakdown

Create new file: `components/modals/RoutineModal/RoutineMuscleBreakdown.tsx`

```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';

interface MuscleData {
    muscle_id: number;
    muscle_name: string;
    muscle_group_id: number;
    muscle_group_name: string;
    avg_intensity: number;
    exercise_count: number;
    exercises: string;
}

interface RoutineMuscleBreakdownProps {
    muscles: MuscleData[];
}

export default function RoutineMuscleBreakdown({ 
    muscles 
}: RoutineMuscleBreakdownProps) {
    
    // Group muscles by muscle group
    const groupedMuscles = muscles.reduce((acc, muscle) => {
        const groupName = muscle.muscle_group_name;
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(muscle);
        return acc;
    }, {} as Record<string, MuscleData[]>);
    
    // Get intensity label
    const getIntensityLabel = (intensity: number) => {
        if (intensity < 0.3) return 'Light';
        if (intensity < 0.6) return 'Moderate';
        if (intensity < 0.8) return 'High';
        return 'Very High';
    };
    
    // Get intensity color
    const getIntensityColor = (intensity: number) => {
        if (intensity < 0.3) return '#90EE90';
        if (intensity < 0.6) return '#FFD700';
        if (intensity < 0.8) return '#FFA500';
        return '#FF6B6B';
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Muscles Worked</Text>
            {Object.entries(groupedMuscles).map(([groupName, groupMuscles]) => (
                <View key={groupName} style={styles.muscleGroup}>
                    <Text style={styles.muscleGroupName}>{groupName}</Text>
                    {groupMuscles.map((muscle) => (
                        <View key={muscle.muscle_id} style={styles.muscleItem}>
                            <View style={styles.muscleInfo}>
                                <Text style={styles.muscleName}>• {muscle.muscle_name}</Text>
                                <Text style={styles.exerciseCount}>
                                    {muscle.exercise_count} exercise{muscle.exercise_count > 1 ? 's' : ''}
                                </Text>
                            </View>
                            <View 
                                style={[
                                    styles.intensityBadge, 
                                    { backgroundColor: getIntensityColor(muscle.avg_intensity) }
                                ]}
                            >
                                <Text style={styles.intensityText}>
                                    {getIntensityLabel(muscle.avg_intensity)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    muscleGroup: {
        marginBottom: 16,
    },
    muscleGroupName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    muscleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
        marginBottom: 4,
    },
    muscleInfo: {
        flex: 1,
    },
    muscleName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    exerciseCount: {
        fontSize: 12,
        color: '#888',
    },
    intensityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    intensityText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#333',
    },
});
```

### Phase 3: Enhanced Routine Modal

Update `components/modals/RoutineModal/RoutineModal.tsx` to include muscle visualization:

```typescript
import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RoutineMuscleDiagram from './RoutineMuscleDiagram';
import RoutineMuscleBreakdown from './RoutineMuscleBreakdown';
import ExerciseHeader from './ExerciseHeader';
import { DataContext } from '@/contexts/DataContext';

// ... existing interface ...

export default function RoutineModal({ visible, close, start, routine, onFavoriteChange }: RoutineModalProps) {
    // ... existing state ...
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [muscles, setMuscles] = useState([]);
    const [diagramView, setDiagramView] = useState<'front' | 'back'>('front');
    const [activeTab, setActiveTab] = useState<'exercises' | 'muscles'>('exercises');
    
    const { getRoutineMuscleGroupSummary, getRoutineMuscleBreakdown } = useContext(DataContext);
    
    // Fetch muscle data when routine changes
    useEffect(() => {
        if (routine?.id && visible) {
            const fetchMuscleData = async () => {
                try {
                    const [groupData, muscleData] = await Promise.all([
                        getRoutineMuscleGroupSummary(routine.id),
                        getRoutineMuscleBreakdown(routine.id)
                    ]);
                    setMuscleGroups(groupData);
                    setMuscles(muscleData);
                } catch (error) {
                    console.error('Error fetching muscle data for routine:', error);
                }
            };
            fetchMuscleData();
        }
    }, [routine?.id, visible]);
    
    // ... existing handlers ...
    
    return (
        <Modal visible={visible} transparent={true} animationType='fade'>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    {/* Header - unchanged */}
                    
                    {/* Tab Selector */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'exercises' && styles.activeTab]}
                            onPress={() => setActiveTab('exercises')}
                        >
                            <Text style={[styles.tabText, activeTab === 'exercises' && styles.activeTabText]}>
                                Exercises
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'muscles' && styles.activeTab]}
                            onPress={() => setActiveTab('muscles')}
                        >
                            <Text style={[styles.tabText, activeTab === 'muscles' && styles.activeTabText]}>
                                Muscles
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Content */}
                    <ScrollView style={styles.contentContainer}>
                        {activeTab === 'exercises' ? (
                            // Existing exercises list
                            routine.exercises.map((exercise) => (
                                <ExerciseHeader key={exercise.id} exercise={exercise} />
                            ))
                        ) : (
                            // New muscle visualization
                            <View>
                                {/* View Toggle */}
                                <View style={styles.viewToggle}>
                                    <TouchableOpacity 
                                        style={[styles.viewButton, diagramView === 'front' && styles.activeViewButton]}
                                        onPress={() => setDiagramView('front')}
                                    >
                                        <Text style={styles.viewButtonText}>Front</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.viewButton, diagramView === 'back' && styles.activeViewButton]}
                                        onPress={() => setDiagramView('back')}
                                    >
                                        <Text style={styles.viewButtonText}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Muscle Diagram */}
                                <RoutineMuscleDiagram 
                                    muscleGroups={muscleGroups}
                                    view={diagramView}
                                />
                                
                                {/* Muscle Breakdown */}
                                <RoutineMuscleBreakdown muscles={muscles} />
                            </View>
                        )}
                    </ScrollView>
                    
                    {/* Start Button - unchanged */}
                </View>
            </View>
        </Modal>
    );
}

// Add new styles
const styles = StyleSheet.create({
    // ... existing styles ...
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginTop: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#ff8787',
    },
    tabText: {
        fontSize: 14,
        color: '#888',
    },
    activeTabText: {
        color: '#ff8787',
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        marginTop: 12,
    },
    viewToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    viewButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    activeViewButton: {
        backgroundColor: '#ff8787',
    },
    viewButtonText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
```

## Database Schema Changes

### Option 1: No Changes Required (Recommended)

The existing database schema already supports this feature through:
- **ExerciseMuscles**: Links exercises to muscles with intensity
- **Muscles**: Individual muscle definitions
- **MuscleGroups**: Muscle group definitions
- **RoutineExercises**: Links routines to exercises

**Advantages:**
- Zero migration required
- All data already available
- Queries are straightforward joins
- No risk of data inconsistency

### Option 2: Add Cached Routine Muscle Data (Future Enhancement)

If performance becomes a concern with complex routines, consider adding a cache table:

```sql
CREATE TABLE RoutineMuscleCache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL,
    muscle_group_id INTEGER NOT NULL,
    avg_intensity REAL NOT NULL,
    total_intensity REAL NOT NULL,
    exercise_count INTEGER NOT NULL,
    muscle_count INTEGER NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (routine_id) REFERENCES Routines(id),
    FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroups(id),
    UNIQUE(routine_id, muscle_group_id)
);
```

**Invalidation Strategy:**
- Invalidate when routine exercises are added/removed
- Invalidate when exercise muscle mappings change
- Set TTL of 24 hours for good measure

**Advantages:**
- Faster query performance for frequently accessed routines
- Reduced database load

**Disadvantages:**
- Additional complexity
- Cache invalidation logic required
- Potential for stale data
- More storage required

## Integration with MuscleRatio.json

### Weighted Intensity Calculation

For more accurate muscle group intensity, incorporate muscle ratios from `MuscleRatio.json`:

```typescript
import muscleRatios from '@/data/MuscleRatio.json';

interface MuscleIntensity {
    muscle_name: string;
    avg_intensity: number;
}

interface MuscleGroup {
    muscle_group_name: string;
    muscles: MuscleIntensity[];
}

/**
 * Calculate weighted muscle group intensity using muscle ratios
 */
const calculateWeightedMuscleGroupIntensity = (
    muscleGroupName: string,
    muscles: MuscleIntensity[]
): number => {
    const ratioData = muscleRatios.find(
        r => r.muscle_group.toLowerCase() === muscleGroupName.toLowerCase()
    );
    
    if (!ratioData) {
        // Fallback to simple average if no ratio data
        return muscles.reduce((sum, m) => sum + m.avg_intensity, 0) / muscles.length;
    }
    
    let weightedSum = 0;
    let totalRatioUsed = 0;
    
    muscles.forEach(muscle => {
        const ratioEntry = ratioData.muscles.find(
            m => m.name.toLowerCase() === muscle.muscle_name.toLowerCase()
        );
        
        if (ratioEntry) {
            weightedSum += muscle.avg_intensity * ratioEntry.ratio;
            totalRatioUsed += ratioEntry.ratio;
        }
    });
    
    // Normalize by total ratio used (in case not all muscles are present)
    return totalRatioUsed > 0 ? weightedSum / totalRatioUsed : 0;
};
```

### Usage in Component

```typescript
// In RoutineMuscleDiagram component
useEffect(() => {
    if (muscles.length > 0) {
        // Group muscles by muscle group
        const grouped = groupByMuscleGroup(muscles);
        
        // Calculate weighted intensities
        const weightedGroups = Object.entries(grouped).map(([groupName, groupMuscles]) => ({
            muscle_group_name: groupName,
            weighted_intensity: calculateWeightedMuscleGroupIntensity(
                groupName, 
                groupMuscles.map(m => ({
                    muscle_name: m.muscle_name,
                    avg_intensity: m.avg_intensity
                }))
            ),
            total_exercises: groupMuscles.reduce((sum, m) => sum + m.exercise_count, 0)
        }));
        
        setMuscleGroups(weightedGroups);
    }
}, [muscles]);
```

## Performance Considerations

### Query Optimization

1. **Indexes**: Ensure proper indexes exist for join performance
   ```sql
   CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON RoutineExercises(routine_id);
   CREATE INDEX IF NOT EXISTS idx_exercise_muscles_exercise ON ExerciseMuscles(exercise_id);
   CREATE INDEX IF NOT EXISTS idx_muscles_group ON Muscles(muscle_group_id);
   ```

2. **Query Batching**: Fetch muscle groups and individual muscles in parallel
   ```typescript
   const [groupData, muscleData] = await Promise.all([
       getRoutineMuscleGroupSummary(routine.id),
       getRoutineMuscleBreakdown(routine.id)
   ]);
   ```

3. **Data Caching**: Cache results in component state to avoid re-fetching on re-renders

### Memory Management

1. **Lazy Loading**: Only fetch muscle data when the "Muscles" tab is selected
2. **Cleanup**: Clear muscle data when modal closes to free memory
3. **Throttling**: Debounce rapid modal open/close events

### Rendering Optimization

1. **React.memo**: Memoize RoutineMuscleDiagram and RoutineMuscleBreakdown components
2. **useMemo**: Memoize color calculations and grouped data
3. **FlatList**: For large muscle lists, consider using FlatList instead of map

## UI/UX Design Specifications

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Routine Modal                           │
│ ┌─────────────────────────────────────┐ │
│ │ Header: Title, Stats, Actions       │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────┬─────────────┐           │
│ │ Exercises   │  Muscles    │ <- Tabs  │
│ └─────────────┴─────────────┘           │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │  [Front] [Back] <- View Toggle     │ │
│ │                                     │ │
│ │     ┌───────────────┐               │ │
│ │     │   Body        │               │ │
│ │     │   Diagram     │               │ │
│ │     │   (SVG)       │               │ │
│ │     └───────────────┘               │ │
│ │                                     │ │
│ │  Muscles Worked                     │ │
│ │  ├─ Chest                           │ │
│ │  │  • Chest - [High]    3 exercises│ │
│ │  │  • Upper Chest - [Mod] 1 exercise│ │
│ │  ├─ Back                            │ │
│ │  │  • Lats - [High]     2 exercises│ │
│ │  │  • Traps - [Light]   1 exercise │ │
│ │  └─ ...                             │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │      [Start Workout]                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Color Scheme

**Intensity Levels:**
- **Light (0-0.3)**: `#90EE90` (Light Green) - Recovery-friendly
- **Moderate (0.3-0.6)**: `#FFD700` (Gold) - Balanced intensity
- **High (0.6-0.8)**: `#FFA500` (Orange) - Challenging
- **Very High (0.8-1.0)**: `#FF6B6B` (Red) - Maximum intensity

**UI Elements:**
- **Primary Action**: `#ff8787` (Current app theme)
- **Background**: Theme-aware (light/dark mode)
- **Borders**: `#e0e0e0` (Light gray)
- **Text**: Theme-aware with hierarchy (primary, secondary, tertiary)

### Interaction Patterns

1. **Tab Switching**: Smooth transition between Exercises and Muscles views
2. **View Toggle**: Front/Back body views with animated transitions
3. **Muscle Selection** (Future): Tap muscle on diagram to highlight related exercises
4. **Tooltip** (Future): Long-press muscle for detailed information

### Responsive Design

- Modal adapts to different screen sizes
- Diagram scales proportionally
- Muscle list scrollable on small screens
- Minimum touch target size: 44x44 pixels

## Implementation Phases

### Phase 1: Core Functionality (MVP)
**Timeline**: 1-2 weeks

- [ ] Create database query functions
- [ ] Add DataContext methods
- [ ] Build RoutineMuscleDiagram component (basic)
- [ ] Build RoutineMuscleBreakdown component
- [ ] Update RoutineModal with tabs
- [ ] Basic testing

### Phase 2: Enhanced Visualization
**Timeline**: 1 week

- [ ] Refine SVG muscle diagram
- [ ] Add front/back view toggle
- [ ] Implement weighted intensity calculations
- [ ] Add color gradients and animations
- [ ] Improve mobile responsiveness

### Phase 3: Interactive Features
**Timeline**: 1-2 weeks

- [ ] Tap muscle to highlight exercises
- [ ] Exercise filtering by muscle
- [ ] Muscle detail tooltips
- [ ] Animation transitions
- [ ] Performance optimization

### Phase 4: Advanced Features (Future)
**Timeline**: TBD

- [ ] Routine comparison view
- [ ] Historical muscle engagement tracking
- [ ] Muscle balance recommendations
- [ ] Export muscle breakdown as image
- [ ] Integration with workout history

## Testing Strategy

### Unit Tests

Create test file: `__tests__/db/RoutineMuscleBreakdown.test.js`

```javascript
import { getRoutineMuscleBreakdown, getRoutineMuscleGroupSummary } from '@/db/data/RoutineMuscleBreakdown';

describe('Routine Muscle Breakdown', () => {
    let db;
    let testRoutineId;
    
    beforeEach(async () => {
        // Setup test database with sample routine
        db = await setupTestDB();
        testRoutineId = await createTestRoutine(db);
    });
    
    test('fetches muscle breakdown for routine', async () => {
        const muscles = await getRoutineMuscleBreakdown(db, testRoutineId);
        
        expect(muscles).toBeDefined();
        expect(Array.isArray(muscles)).toBe(true);
        expect(muscles.length).toBeGreaterThan(0);
        expect(muscles[0]).toHaveProperty('muscle_name');
        expect(muscles[0]).toHaveProperty('avg_intensity');
    });
    
    test('fetches muscle group summary for routine', async () => {
        const groups = await getRoutineMuscleGroupSummary(db, testRoutineId);
        
        expect(groups).toBeDefined();
        expect(Array.isArray(groups)).toBe(true);
        expect(groups.length).toBeGreaterThan(0);
        expect(groups[0]).toHaveProperty('muscle_group_name');
        expect(groups[0]).toHaveProperty('total_intensity');
    });
    
    test('handles empty routine gracefully', async () => {
        const emptyRoutineId = await createEmptyRoutine(db);
        const muscles = await getRoutineMuscleBreakdown(db, emptyRoutineId);
        
        expect(muscles).toEqual([]);
    });
});
```

### Component Tests

Create test file: `__tests__/components/RoutineMuscleDiagram.test.tsx`

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import RoutineMuscleDiagram from '@/components/modals/RoutineModal/RoutineMuscleDiagram';

describe('RoutineMuscleDiagram', () => {
    const mockMuscleGroups = [
        { muscle_group_name: 'Chest', avg_intensity: 0.7, exercise_count: 3 },
        { muscle_group_name: 'Back', avg_intensity: 0.5, exercise_count: 2 }
    ];
    
    test('renders diagram correctly', () => {
        const { getByTestId } = render(
            <RoutineMuscleDiagram muscleGroups={mockMuscleGroups} view="front" />
        );
        
        // Add appropriate test assertions
    });
    
    test('switches between front and back views', () => {
        // Test view switching logic
    });
    
    test('applies correct colors based on intensity', () => {
        // Test color calculation
    });
});
```

### Integration Tests

1. **Full Flow Test**: Open routine modal → Switch to Muscles tab → Verify data loads
2. **Performance Test**: Measure load time for routines with varying complexity
3. **Memory Test**: Monitor memory usage with repeated modal open/close

### Manual Testing Checklist

- [ ] Muscle data loads correctly for all test routines
- [ ] Colors accurately represent intensity levels
- [ ] Diagram displays correctly on different screen sizes
- [ ] Tab switching is smooth and responsive
- [ ] Front/Back view toggle works correctly
- [ ] Muscle list scrolls properly on small screens
- [ ] No performance lag with complex routines
- [ ] Works in both light and dark mode
- [ ] Gracefully handles routines with no muscle data

## Error Handling

### Database Query Errors

```typescript
const fetchMuscleData = async () => {
    try {
        const data = await getRoutineMuscleBreakdown(routine.id);
        setMuscles(data);
    } catch (error) {
        console.error('Failed to load muscle data:', error);
        // Show user-friendly error message
        Alert.alert(
            'Data Error',
            'Unable to load muscle information. Please try again.',
            [{ text: 'OK' }]
        );
        // Fallback to exercises view
        setActiveTab('exercises');
    }
};
```

### Missing Data Handling

```typescript
// Handle routines with no exercises
if (muscles.length === 0) {
    return (
        <View style={styles.emptyState}>
            <Text>No muscle data available for this routine.</Text>
            <Text>Add exercises to see muscle breakdown.</Text>
        </View>
    );
}

// Handle exercises with no muscle mapping
const unmappedExercises = routine.exercises.filter(
    ex => !muscles.some(m => m.exercises.includes(ex.title))
);

if (unmappedExercises.length > 0) {
    console.warn('Some exercises lack muscle mapping:', unmappedExercises);
}
```

### Component Error Boundaries

Wrap components in error boundaries to prevent crashes:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
    <RoutineMuscleDiagram muscleGroups={muscleGroups} view={view} />
</ErrorBoundary>
```

## Documentation and Comments

### Code Documentation Standards

```typescript
/**
 * Component that displays a visual representation of muscles worked in a routine
 * 
 * @param muscleGroups - Array of muscle group data with intensity scores
 * @param view - Current view orientation ('front' or 'back')
 * 
 * @example
 * ```tsx
 * <RoutineMuscleDiagram 
 *   muscleGroups={[{ muscle_group_name: 'Chest', avg_intensity: 0.7 }]}
 *   view="front"
 * />
 * ```
 */
export default function RoutineMuscleDiagram({ muscleGroups, view }) {
    // Implementation
}
```

### User-Facing Documentation

Create user guide: `docs/USER_GUIDE_ROUTINE_MUSCLES.md`

Topics to cover:
- How to view muscle breakdown
- Understanding intensity colors
- Using front/back views
- Planning balanced workouts

## Future Enhancements

### Priority 1: Interactive Features

1. **Muscle Highlighting**: Tap muscle group to see which exercises target it
2. **Exercise Filtering**: Filter exercise list by selected muscle
3. **Comparison Mode**: Compare muscle engagement across multiple routines

### Priority 2: Analytics

1. **Historical Tracking**: Show muscle engagement trends over time
2. **Balance Score**: Calculate and display workout balance metrics
3. **Recovery Integration**: Show which muscles need rest based on soreness history

### Priority 3: Customization

1. **User Preferences**: Remember preferred view (front/back)
2. **Color Themes**: Custom color schemes for intensity levels
3. **Detail Level**: Toggle between simple and detailed views

### Priority 4: Social Features

1. **Share Routine**: Export muscle breakdown as image
2. **Routine Templates**: Save and share muscle-balanced routines
3. **Community Routines**: Browse routines by target muscle groups

## Migration and Rollout

### Development Environment

1. Develop on feature branch
2. Test with sample routines
3. Performance profiling
4. Code review

### Staging Environment

1. Deploy to beta testers
2. Gather feedback
3. Monitor performance
4. Fix bugs

### Production Rollout

1. **Phase 1 (Week 1)**: 10% of users
2. **Phase 2 (Week 2)**: 50% of users
3. **Phase 3 (Week 3)**: 100% of users

### Rollback Plan

- Feature flag to disable muscle tab
- Fallback to exercise-only view
- Quick hotfix pipeline ready

## Conclusion

This implementation plan provides a comprehensive roadmap for integrating Muscle Soreness calculations into routine modals. The feature enhances user experience by providing visual, intuitive feedback about muscle engagement before starting a workout.

### Key Benefits

1. **User Education**: Visual learning about muscle anatomy and exercise targeting
2. **Better Planning**: Make informed decisions about which routines to perform
3. **Workout Balance**: Identify and address muscle imbalances
4. **Motivation**: See comprehensive muscle coverage in routines

### Next Steps

1. Review and approve this documentation
2. Create detailed task breakdown for Phase 1
3. Set up development environment
4. Begin implementation of core functionality

### Success Metrics

- User engagement with Muscles tab (target: 40% of routine views)
- Average time spent on muscle visualization (target: 10-15 seconds)
- User feedback score (target: 4.5+ / 5)
- Performance impact (target: < 100ms load time)
- Bug rate (target: < 1% crash rate)

## References

- **Existing Documentation**: `docs/MUSCLE_SORENESS_RECALCULATION.md`
- **Components**: `components/Profile/MuscleSoreness/`
- **Database**: `api/startup.js`, `db/data/MuscleGroupBreakdown.js`
- **Data**: `data/MuscleRatio.json`, `data/Muscles.json`
