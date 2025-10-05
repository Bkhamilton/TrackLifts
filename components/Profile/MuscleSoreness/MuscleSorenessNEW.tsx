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
            value: 0,
            description: 'The chest muscles (pectoralis major) are responsible for pushing movements and shoulder adduction.',
            exercises: ['']
        },
        { 
            id: 'back', 
            name: 'Back', 
            value: 0,
            description: 'Back muscles (latissimus dorsi, trapezius, rhomboids) are crucial for pulling movements and posture.',
            exercises: ['']
        },
        { 
            id: 'arms', 
            name: 'Arms', 
            value: 0,
            description: 'Arm muscles (biceps, triceps, forearms) control elbow flexion/extension and grip strength.',
            exercises: ['']
        },
        { 
            id: 'shoulders', 
            name: 'Shoulders', 
            value: 0,
            description: 'Shoulder muscles (deltoids) enable arm rotation and lifting movements.',
            exercises: ['']
        },
        { 
            id: 'core', 
            name: 'Core', 
            value: 0,
            description: 'Core muscles (abdominals, obliques) stabilize the torso and transfer force between upper/lower body.',
            exercises: ['']
        },
        { 
            id: 'legs', 
            name: 'Legs', 
            value: 0,
            description: 'Leg muscles (quadriceps, hamstrings, glutes, calves) power locomotion and lower body movements.',
            exercises: ['']
        },
    ].map(m => {
        const dbData = muscleGroupSoreness.find(s => 
            s.muscle_group.toLowerCase() === m.name.toLowerCase()
        );
        
        if (!dbData) return { ...m, value: 0, rawScore: 0, maxSoreness: 1 };
        
        const rawScore = dbData.soreness_score || 0;
        const maxSoreness = dbData.max_soreness || 1;
        
        // Enhanced normalization function
        const linear = rawScore / maxSoreness;
        const curved = 1 - Math.exp(-0.8 * linear);
        const alpha = 0.2; // 0 = pure linear, 1 = pure curved
        const normalizedSoreness = Math.min(
            (1 - alpha) * linear + alpha * curved, 1
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

    // Anatomically accurate SVG paths from new muscle group SVGs
    const musclePaths: MusclePaths = {
        front: {
            // Chest - left and right pectorals from chest_front.svg
            chest: "M 62,90 C 72,85 82,85 88,89 C 92,92 93,105 90,113 C 87,119 65,118 63,116 C 60,115 58,97 62,90 Z " +
                   "M 123,90 C 113,85 103,85 97,89 C 93,92 92,105 95,113 C 98,119 120,118 122,116 C 125,115 127,97 123,90 Z",
            
            // Shoulders - left and right deltoids from shoulders_front.svg
            shoulders: "M 52,78 C 56,73 62,70 68,70 C 74,70 80,72 84,76 C 86,78 87,82 86,86 C 84,90 80,92 76,93 C 70,94 63,93 58,90 C 54,88 51,83 52,78 Z " +
                       "M 133,78 C 129,73 123,70 117,70 C 111,70 105,72 101,76 C 99,78 98,82 99,86 C 101,90 105,92 109,93 C 115,94 122,93 127,90 C 131,88 134,83 133,78 Z",
            
            // Arms - left and right arms from arms_front.svg
            arms: "M 52,85 C 45,95 40,110 38,125 C 37,140 38,155 42,168 C 45,176 50,182 56,185 C 60,183 63,178 64,172 C 65,160 64,145 62,130 C 60,115 57,100 55,90 Z " +
                  "M 133,85 C 140,95 145,110 147,125 C 148,140 147,155 143,168 C 140,176 135,182 129,185 C 125,183 122,178 121,172 C 120,160 121,145 123,130 C 125,115 128,100 130,90 Z",
            
            // Core - abdominals from core_front.svg
            core: "M 72,120 C 77,118 82,117 88,117 C 92,117 97,118 102,120 C 107,125 110,132 112,140 C 113,150 113,160 112,170 C 110,178 107,185 102,190 C 97,192 92,193 88,193 C 83,193 78,192 73,190 C 68,185 65,178 63,170 C 62,160 62,150 63,140 C 65,132 68,125 72,120 Z",
            
            // Legs - left and right legs from legs_front.svg
            legs: "M 68,195 C 65,205 62,220 60,235 C 58,250 57,265 58,280 C 59,292 62,303 67,312 C 70,317 74,320 78,320 C 82,319 85,315 87,310 C 90,300 91,285 90,270 C 89,250 87,230 84,210 C 82,203 79,198 76,195 Z " +
                  "M 117,195 C 120,205 123,220 125,235 C 127,250 128,265 127,280 C 126,292 123,303 118,312 C 115,317 111,320 107,320 C 103,319 100,315 98,310 C 95,300 94,285 95,270 C 96,250 98,230 101,210 C 103,203 106,198 109,195 Z"
        },
        back: {
            // Back - upper and mid back from muscles_back_back.svg
            back: "M 50 65 C 60 55 70 52 82.5 52 C 95 52 105 55 115 65 L 115 70 C 120 80 122 95 122 115 C 122 140 118 165 115 185 C 112 195 105 200 95 202 C 88 203 77 203 70 202 C 60 200 53 195 50 185 C 47 165 43 140 43 115 C 43 95 45 80 50 70 L 50 65 Z",
            
            // Shoulders - posterior deltoids from muscles_back_shoulders.svg
            shoulders: "M 45 60 C 52 50 60 45 70 45 C 75 45 80 48 82.5 52 C 85 48 90 45 95 45 C 105 45 113 50 120 60 L 120 65 C 122 70 122 75 120 80 C 118 85 115 90 110 92 L 95 95 L 82.5 95 L 70 95 L 55 92 C 50 90 47 85 45 80 C 43 75 43 70 45 65 L 45 60 Z",
            
            // Arms - biceps and triceps from muscles_back_arms.svg
            arms: "M 40 65 C 35 70 32 80 30 95 C 28 110 27 130 28 145 C 29 160 31 172 35 180 C 38 186 42 190 47 192 C 50 190 52 185 53 178 C 54 165 53 145 52 125 C 51 105 48 85 45 75 L 40 65 Z " +
                  "M 125 65 C 130 70 133 80 135 95 C 137 110 138 130 137 145 C 136 160 134 172 130 180 C 127 186 123 190 118 192 C 115 190 113 185 112 178 C 111 165 112 145 113 125 C 114 105 117 85 120 75 L 125 65 Z",
            
            // Legs - hamstrings, glutes, calves from muscles_back_legs.svg
            legs: "M 52 190 C 50 195 48 205 47 220 C 46 235 46 250 47 265 C 48 280 50 292 54 302 C 57 310 61 316 66 320 C 70 318 73 313 75 305 C 77 292 78 275 78 255 C 78 235 77 215 75 200 C 73 190 70 185 66 185 L 52 190 Z " +
                  "M 113 190 C 115 195 117 205 118 220 C 119 235 119 250 118 265 C 117 280 115 292 111 302 C 108 310 104 316 99 320 C 95 318 92 313 90 305 C 88 292 87 275 87 255 C 87 235 88 215 90 200 C 92 190 95 185 99 185 L 113 190 Z"
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
                    <Svg 
                        width={300} 
                        height={400} 
                        viewBox={view === 'front' ? "0 0 185 335" : "0 0 165 331"}
                    >
                        {view === 'front' ? (
                            <>
                                {/* Front Body Outline */}
                                {/* Torso */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 67.5,75 C 57.5,75 57.5,95 62.5,120 L 67.5,190 L 117.5,190 L 122.5,120 C 127.5,95 127.5,75 117.5,75 Z"
                                />
                                
                                {/* Head */}
                                <Path
                                    strokeWidth="2"
                                    stroke="#ccc"
                                    fill="#f8f8f8"
                                    d="M 75.0,40 C 75.0,20 110.0,20 110.0,40 C 110.0,60 75.0,60 75.0,40 Z"
                                />
                                
                                {/* Left Arm */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 62.5,85 C 47.5,95 42.5,130 44.5,165 C 45.5,180 49.5,185 54.5,185 L 57.5,180 C 57.5,155 59.5,120 62.5,95 Z"
                                />
                                
                                {/* Right Arm */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 122.5,85 C 137.5,95 142.5,130 140.5,165 C 139.5,180 135.5,185 130.5,185 L 127.5,180 C 127.5,155 125.5,120 122.5,95 Z"
                                />
                                
                                {/* Left Leg */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 72.5,195 C 70.5,220 67.5,270 69.5,295 C 70.5,310 74.5,320 80.5,320 C 84.5,320 87.5,315 88.5,305 C 89.5,275 90.5,230 87.5,195 Z"
                                />
                                
                                {/* Right Leg */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 112.5,195 C 114.5,220 117.5,270 115.5,295 C 114.5,310 110.5,320 104.5,320 C 100.5,320 97.5,315 96.5,305 C 95.5,275 94.5,230 97.5,195 Z"
                                />
                            </>
                        ) : (
                            <>
                                {/* Back Body Outline */}
                                {/* Torso */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 57.5,75 C 47.5,75 47.5,95 52.5,120 L 57.5,190 L 107.5,190 L 112.5,120 C 117.5,95 117.5,75 107.5,75 Z"
                                />
                                
                                {/* Head */}
                                <Path
                                    strokeWidth="2"
                                    stroke="#ccc"
                                    fill="#f8f8f8"
                                    d="M 65.0,40 C 65.0,20 100.0,20 100.0,40 C 100.0,60 65.0,60 65.0,40 Z"
                                />
                                
                                {/* Left Arm */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 52.5,85 C 37.5,95 32.5,130 34.5,165 C 35.5,180 39.5,185 44.5,185 L 47.5,180 C 47.5,155 49.5,120 52.5,95 Z"
                                />
                                
                                {/* Right Arm */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 112.5,85 C 127.5,95 132.5,130 130.5,165 C 129.5,180 125.5,185 120.5,185 L 117.5,180 C 117.5,155 115.5,120 112.5,95 Z"
                                />
                                
                                {/* Left Leg */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 62.5,195 C 60.5,220 57.5,270 59.5,295 C 60.5,310 64.5,316 70.5,316 C 74.5,316 77.5,311 78.5,301 C 79.5,271 80.5,230 77.5,195 Z"
                                />
                                
                                {/* Right Leg */}
                                <Path
                                    stroke="#ccc"
                                    strokeWidth="2"
                                    fill="#f8f8f8"
                                    d="M 102.5,195 C 104.5,220 107.5,270 105.5,295 C 104.5,310 100.5,316 94.5,316 C 90.5,316 87.5,311 86.5,301 C 85.5,271 84.5,230 87.5,195 Z"
                                />
                            </>
                        )}
                        
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
