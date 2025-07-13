import { Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MuscleInfoPanel from './MuscleInfoPanel';
import SorenessLegend from './SorenessLegend';

type MuscleGroup = {
  id: string;
  name: string;
  value: number;
  description: string;
  exercises: string[];
};

type MusclePaths = {
  front: Record<string, string>;
  back: Record<string, string>;
};

const MuscleSoreness = () => {
    const [view, setView] = useState<'front' | 'back'>('front');
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');
    
    const { muscleGroupSoreness, getRecentExercises } = useContext(DataContext);

    // Muscle data with descriptions and exercises
    const muscleData: MuscleGroup[] = [
        { 
            id: 'chest', 
            name: 'Chest', 
            value: 0.8,
            description: 'The chest muscles (pectoralis major) are responsible for pushing movements and shoulder adduction.',
            exercises: ['Bench Press', 'Push-ups', 'Chest Fly', 'Incline Dumbbell Press']
        },
        { 
            id: 'back', 
            name: 'Back', 
            value: 0.6,
            description: 'Back muscles (latissimus dorsi, trapezius, rhomboids) are crucial for pulling movements and posture.',
            exercises: ['Pull-ups', 'Bent-over Rows', 'Deadlifts', 'Lat Pulldowns']
        },
        { 
            id: 'arms', 
            name: 'Arms', 
            value: 0.7,
            description: 'Arm muscles (biceps, triceps, forearms) control elbow flexion/extension and grip strength.',
            exercises: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Dips']
        },
        { 
            id: 'shoulders', 
            name: 'Shoulders', 
            value: 0.5,
            description: 'Shoulder muscles (deltoids) enable arm rotation and lifting movements.',
            exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Upright Rows']
        },
        { 
            id: 'core', 
            name: 'Core', 
            value: 0.2,
            description: 'Core muscles (abdominals, obliques) stabilize the torso and transfer force between upper/lower body.',
            exercises: ['Planks', 'Russian Twists', 'Leg Raises', 'Crunches']
        },
        { 
            id: 'legs', 
            name: 'Legs', 
            value: 0.75,
            description: 'Leg muscles (quadriceps, hamstrings, glutes, calves) power locomotion and lower body movements.',
            exercises: ['Squats', 'Lunges', 'Deadlifts', 'Calf Raises']
        },
    ].map(m => {
        const dbData = muscleGroupSoreness.find(s => 
            s.muscle_group.toLowerCase() === m.name.toLowerCase()
        );
        
        if (!dbData) return { ...m, value: 0, rawScore: 0, maxSoreness: 1 };
        
        const rawScore = dbData.soreness_score || 0;
        const maxSoreness = dbData.max_soreness || 1;
        
        // Enhanced normalization function
        const normalizedSoreness = Math.min(
            1 - Math.exp(-0.8 * (rawScore / maxSoreness)),
            1
        );

        // grab exercises from workout
        getRecentExercises(m.name).then(exercises => {
            m.exercises = exercises.map(e => e.name);
        }).catch(err => {
            console.error(`Error fetching exercises for ${m.name}:`, err);
        });

        return {
            ...m,
            value: normalizedSoreness,
            rawScore,
            maxSoreness
        };
    });
    
    // Improved color gradient: green (0) → yellow (0.5) → red (1)
    const getColor = (intensity: number): string => {
        if (intensity <= 0.5) {
            // Green to yellow gradient
            const r = Math.floor(50 + (intensity * 2 * 205));
            const g = Math.floor(205);
            const b = Math.floor(50);
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // Yellow to red gradient
            const r = Math.floor(255);
            const g = Math.floor(205 - ((intensity - 0.5) * 2 * 155));
            const b = Math.floor(50 - ((intensity - 0.5) * 2 * 50));
            return `rgb(${r}, ${g}, ${b})`;
        }
    };

    // More anatomically accurate SVG paths
    const musclePaths: MusclePaths = {
        front: {
            // Chest now with two distinct pecs (left and right)
            chest: "M 107 110 C 121 101 151 101 153 107 C 170 112 167 137 157 145 C 151 153 112 150 109 146 C 103 147 97 121 107 110 Z M 216 103 C 207 99 170 100 167 106 C 165 108 164 140 171 144 C 184 150 218 143 218 141 C 231 124 224 111 221 106 Z",
            
            // Shoulders - unchanged
            shoulders: "M 97 110 C 118 91 134 91 159 99 C 176 91 193 91 217 109 C 215 114 172 115 160 115 C 150 115 98 115 97 110 Z",
            
            // Arms - unchanged
            arms: "M 85 115 C 52 153 48 203 61 223 C 78 218 97 189 92 149 Z " +
                "M 229 109 C 245 135 263 191 249 224 C 234 210 219 181 221 141 Z",
            
            // Core - unchanged
            core: "M 134 192 C 154 201 172 197 191 186 C 202 240 186 267 165 268 C 139 268 117 245 123 186 Z",
            
            // Legs - spaced further apart (increased x-values by 15 on each side)
            legs: "M95,260 C90,290 85,340 105,370 C115,350 120,310 120,280 Z " +
                "M225,260 C230,290 235,340 215,370 C205,350 200,310 200,280 Z"
        },
        back: {
            // Back - unchanged
            back: "M 99 120 C 120 103 196 102 215 120 C 207 158 202 235 163 230 C 124 235 110 160 99 120 Z",
            
            // Shoulders - unchanged
            shoulders: "M 97 110 C 118 91 134 91 159 99 C 176 91 193 91 217 109 C 215 114 172 115 160 115 C 150 115 98 115 97 110 Z",
            
            // Arms - unchanged
            arms: "M 85 115 C 52 153 48 203 61 223 C 78 218 97 189 92 149 Z " +
                "M 229 109 C 245 135 263 191 249 224 C 234 210 219 181 221 141 Z",
            
            // Legs - spaced further apart to match front changes
            legs: "M95,260 C90,290 80,340 105,360 C115,345 120,310 120,280 Z " +
                "M225,260 C230,290 240,340 215,360 C205,345 200,310 200,280 Z"
        }
    };

    // Get currently selected muscle data
    const selectedMuscleData = selectedMuscle 
        ? muscleData.find(m => m.id === selectedMuscle) ?? null
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
                    Muscle Soreness Visualization
                </Text>
            </View>
            <View style={{ width: '100%', paddingHorizontal: 16 }}>
                <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
            </View>

            {/* View Toggle */}
            <View style={[styles.toggleContainer, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
                <TouchableOpacity 
                    style={[styles.toggleButton, view === 'front' && styles.activeToggle]}
                    onPress={() => setView('front')}
                >
                    <Text style={view === 'front' ? styles.activeText : styles.inactiveText}>Front View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.toggleButton, view === 'back' && styles.activeToggle]}
                    onPress={() => setView('back')}
                >
                    <Text style={view === 'back' ? styles.activeText : styles.inactiveText}>Back View</Text>
                </TouchableOpacity>
            </View>
            
            {/* Body and Info Container */}
            <View style={styles.bodyInfoContainer}>
                {/* Body Visualization */}
                <View style={styles.bodyContainer}>
                    <Svg width={300} height={400} viewBox="0 0 300 400">
                        {/* Torso */}
                        <Path
                            transform="rotate(0.0271671 159.485 190.063)"
                            stroke="#ccc"
                            strokeWidth="2"
                            fill="#f8f8f8"
                            d="m159.4846,95.86142c20.57139,-9.55146 47.9999,-9.55146 61.71416,4.09348c13.71426,13.64494 13.71426,40.93483 6.85713,68.22472c-23.31424,23.87865 -13.71426,54.57977 -20.57139,81.86966c-6.85713,27.28989 -27.42852,40.93483 -47.9999,40.93483c-20.57139,0 -41.14277,-13.64494 -47.9999,-40.93483c-6.85713,-27.28989 0,-55.94427 -20.57139,-81.86966c-6.85713,-27.28989 -6.85713,-54.57977 6.85713,-68.22472c13.71426,-13.64494 41.14277,-13.64494 61.71416,-4.09348z"
                        />
                        
                        {/* Head */}
                        <Path
                            strokeWidth="2"
                            stroke="#ccc"
                            fill="#f8f8f8"
                            d="m123,23c20,-20 50,-20 70,0c10,20 10,40 0,60c-20,10 -50,10 -70,0c-10,-20 -10,-40 0,-60z"
                        />
                        
                        {/* Left Arm */}
                        <Path
                            transform="rotate(7.60753 77.5107 170)"
                            stroke="#ccc"
                            strokeWidth="2"
                            fill="#f8f8f8"
                            d="m81.60118,104c-23.44583,36 -35.16874,96 -11.72291,132c23.44583,-12 35.16874,-60 23.44583,-96l-11.72291,-36z"
                        />
                        
                        {/* Right Arm */}
                        <Path
                            transform="rotate(-5.296 236.489 168)"
                            stroke="#ccc"
                            strokeWidth="2"
                            fill="#f8f8f8"
                            d="m232.79961,99c21.14861,37.63636 31.72291,100.36364 10.5743,138c-21.14861,-12.54545 -31.72291,-62.72727 -21.14861,-100.36364l10.5743,-37.63636z"
                        />
                        
                        {/* Left Leg */}
                        <Path
                            stroke="#ccc"
                            strokeWidth="2"
                            fill="#f8f8f8"
                            d="m100.60434,246c-12.25542,45 -24.51085,101.25 0,135c24.51085,-11.25 36.76627,-67.5 24.51085,-101.25l-24.51085,-33.75z"
                        />
                        
                        {/* Right Leg */}
                        <Path
                            stroke="#ccc"
                            strokeWidth="2"
                            fill="#f8f8f8"
                            d="m218.37229,246c11.40964,43 22.81928,96.75 0,129.00001c-22.81928,-10.75 -34.22892,-64.5 -22.81928,-96.75l22.81928,-32.25z"
                        />
                        
                        {/* Muscle groups with selectable highlighting */}
                        {Object.entries(musclePaths[view]).map(([group, path]) => {
                            const muscle = muscleData.find(m => m.id === group) || { value: 0 };
                            const isSelected = selectedMuscle === group;
                            
                            return (
                                <Path 
                                    key={group}
                                    d={path} 
                                    fill={getColor(muscle.value)} 
                                    stroke={isSelected ? "#4a86e8" : "#555"}
                                    strokeWidth={isSelected ? 3 : 1.5}
                                    opacity={0.85}
                                />
                            );
                        })}
                    </Svg>
                </View>
                
                {/* Muscle Info Panel */}
                <View style={[styles.infoContainer, { backgroundColor: cardBackground }]}>
                    <MuscleInfoPanel
                        selectedMuscleData={selectedMuscleData}
                        muscleData={muscleData}
                        selectedMuscle={selectedMuscle}
                        setSelectedMuscle={setSelectedMuscle}
                        getColor={getColor}
                        view={view}
                    />
                </View>
            </View>

            {/* Soreness Legend */}
            <SorenessLegend getColor={getColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    activeToggle: {
        backgroundColor: '#ff8787',
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inactiveText: {
        fontWeight: 'normal',
    },
    bodyInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    bodyContainer: {
        width: '50%',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
    },
    infoContainer: {
        width: '45%',
        borderRadius: 10,
        padding: 8,
        elevation: 2,
    },
    headerContainer: {
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
    },
    getStartedText: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    separator: {
        marginVertical: 12,
        height: 1,
        width: '100%',
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    },
});

export default MuscleSoreness;