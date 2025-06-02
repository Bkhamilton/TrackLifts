import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, PathProps } from 'react-native-svg';

type MuscleGroup = {
  id: string;
  name: string;
  value: number;
};

type MusclePaths = {
  front: Record<string, string>;
  back: Record<string, string>;
};

type CircleProps = {
  cx: string | number;
  cy: string | number;
  r: string | number;
} & PathProps;

const MuscleIntensityVisualization = () => {
    const [view, setView] = useState<'front' | 'back'>('front');
    
    // Mock data for muscle group intensities
    const muscleData: MuscleGroup[] = [
        { id: 'chest', name: 'Chest', value: 0.8 },
        { id: 'back', name: 'Back', value: 0.6 },
        { id: 'arms', name: 'Arms', value: 0.7 },
        { id: 'shoulders', name: 'Shoulders', value: 0.5 },
        { id: 'core', name: 'Core', value: 0.9 },
        { id: 'legs', name: 'Legs', value: 0.75 },
    ];
    
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
            // Chest (pectoralis major) - Adjusted to fit the torso curve
            chest: "M130,120 C150,100 190,100 210,120 C200,140 180,140 160,140 C150,135 140,130 130,120 Z",
            
            // Shoulders (deltoids) - Aligned with head position
            shoulders: "M110,110 C130,90 190,90 210,110 C200,120 180,120 160,120 C150,115 140,115 130,120 C125,115 115,110 110,110 Z",
            
            // Arms (biceps/triceps) - Matched to arm paths
            arms: "M90,130 C80,160 70,210 90,240 C100,230 110,190 100,160 Z " +
                "M220,130 C230,160 240,210 220,240 C210,230 200,190 210,160 Z",
            
            // Core (abdominals) - Fitted to torso shape
            core: "M140,150 C150,170 170,170 180,150 C170,210 160,210 150,190 C145,180 140,170 140,150 Z",
            
            // Legs (quadriceps) - Aligned with leg paths
            legs: "M120,250 C115,280 110,330 125,360 C135,340 140,300 140,270 Z " +
                "M190,250 C195,280 200,330 185,360 C175,340 170,300 170,270 Z"
        },
        back: {
            // Back (latissimus dorsi) - Wider to match back shape
            back: "M130,120 C150,100 190,100 210,120 C200,180 180,180 150,160 C140,150 135,140 130,120 Z",
            
            // Shoulders (rear deltoids)
            shoulders: "M110,110 C130,90 190,90 210,110 C200,120 180,120 160,120 C150,115 140,115 130,120 C125,115 115,110 110,110 Z",
            
            // Arms (triceps) - More defined triceps area
            arms: "M90,130 C85,150 80,200 95,230 C105,220 110,180 105,150 Z " +
                "M220,130 C225,150 230,200 215,230 C205,220 200,180 205,150 Z",
            
            // Legs (hamstrings/glutes) - Adjusted for hamstring curve
            legs: "M120,250 C115,280 105,330 125,350 C135,340 140,300 140,270 Z " +
                "M190,250 C195,280 205,330 185,350 C175,340 170,300 170,270 Z"
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Muscle Group Intensity</Text>
            
            {/* View Toggle */}
            <View style={styles.toggleContainer}>
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
                    
                    {/* Now add your muscle groups as before */}
                    {Object.entries(musclePaths[view]).map(([group, path]) => {
                        const muscle = muscleData.find(m => m.id === group) || { value: 0 };
                        return (
                            <Path 
                                key={group}
                                d={path} 
                                fill={getColor(muscle.value)} 
                                stroke="#555" 
                                strokeWidth="1.5"
                                opacity={0.85}
                            />
                        );
                    })}
                </Svg>
            </View>
            
            {/* Muscle Group Labels */}
            <View style={styles.labelsContainer}>
                {muscleData.map((muscle) => (
                    <View key={muscle.id} style={styles.labelItem}>
                        <View 
                            style={[styles.colorBox, { backgroundColor: getColor(muscle.value) }]} 
                        />
                            <Text style={styles.labelText}>
                            {muscle.name}: <Text style={styles.valueText}>{Math.round(muscle.value * 100)}%</Text>
                            </Text>
                    </View>
                ))}
            </View>
            
            {/* Intensity Legend */}
            <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Intensity Scale:</Text>
                <View style={styles.legendBar}>
                    {[...Array(10)].map((_, i) => (
                        <View 
                            key={i} 
                            style={[
                                styles.legendSegment, 
                                { backgroundColor: getColor(i / 9) }
                            ]} 
                        />
                    ))}
                </View>
                <View style={styles.legendLabels}>
                    <Text style={styles.legendLabel}>Low</Text>
                    <Text style={styles.legendLabel}>Medium</Text>
                    <Text style={styles.legendLabel}>High</Text>
                </View>
            </View>
        </View>
    );
};

// Helper components
const Circle = ({ cx, cy, r, ...props }: CircleProps) => (
    <Path 
        d={`M${cx},${cy} m${-r},0 a${r},${r} 0 1,0 ${Number(r)*2},0 a${r},${r} 0 1,0 ${-r*2},0`}
        {...props}
    />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    activeToggle: {
        backgroundColor: '#4a86e8',
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inactiveText: {
        color: '#666',
    },
    bodyContainer: {
        marginVertical: 15,
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 10,
        padding: 15,
        elevation: 2,
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 15,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    colorBox: {
        width: 22,
        height: 22,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    labelText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
    },
    valueText: {
        fontWeight: 'bold',
        color: '#222',
    },
    legendContainer: {
        alignItems: 'center',
        marginTop: 15,
        width: '90%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    legendBar: {
        flexDirection: 'row',
        height: 25,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
    },
    legendSegment: {
        flex: 1,
    },
    legendLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    legendLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
});

export default MuscleIntensityVisualization;