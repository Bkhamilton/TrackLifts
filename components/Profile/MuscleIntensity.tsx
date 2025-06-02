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
            // Chest (pectoralis major)
            chest: "M150,120 C170,100 190,100 200,120 C190,140 170,140 150,140 Z",
            
            // Shoulders (deltoids)
            shoulders: "M120,120 C130,100 170,100 180,120 C170,140 130,140 120,120 Z",
            
            // Arms (biceps/triceps)
            arms: "M100,140 C90,160 90,200 100,220 C120,200 120,160 110,140 Z " +
                    "M200,140 C210,160 210,200 200,220 C180,200 180,160 190,140 Z",
            
            // Core (abdominals)
            core: "M140,150 C150,170 160,170 170,150 C160,200 150,200 140,180 Z",
            
            // Legs (quadriceps)
            legs: "M140,200 C140,220 130,250 140,280 C150,260 160,260 160,240 Z " +
                    "M160,200 C160,220 170,250 160,280 C150,260 140,260 140,240 Z"
        },
        back: {
            // Back (latissimus dorsi)
            back: "M150,120 C170,100 190,100 200,120 C190,180 170,180 150,150 Z",
            
            // Shoulders (rear deltoids)
            shoulders: "M120,120 C130,100 170,100 180,120 C170,140 130,140 120,120 Z",
            
            // Arms (triceps)
            arms: "M100,140 C90,160 90,200 100,220 C120,200 120,160 110,140 Z " +
                    "M200,140 C210,160 210,200 200,220 C180,200 180,160 190,140 Z",
            
            // Legs (hamstrings/glutes)
            legs: "M140,200 C140,220 130,250 140,280 C150,260 160,260 160,240 Z " +
                    "M160,200 C160,220 170,250 160,280 C150,260 140,260 140,240 Z"
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
                    {/* Body outline - your existing torso */}
                    <Path 
                        d="M150,54 C180,40 220,40 240,60 C260,80 260,120 250,160 C216,195 230,240 220,280 C210,320 180,340 150,340 C120,340 90,320 80,280 C70,240 80,198 50,160 C40,120 40,80 60,60 C80,40 120,40 150,54 Z" 
                        fill="#f8f8f8" 
                        stroke="#ccc" 
                        strokeWidth="2"
                    />
                    
                    {/* Head - added above torso */}
                    <Path
                        d="M130,30 C150,10 180,10 200,30 C210,50 210,70 200,90 C180,100 150,100 130,90 C120,70 120,50 130,30 Z"
                        fill="#f8f8f8"
                        stroke="#ccc"
                        strokeWidth="2"
                    />
                    
                    {/* Arms - attached at shoulders */}
                    <Path
                        d="M90,120 C70,150 60,200 80,230 C100,220 110,180 100,150 Z
                        M210,120 C230,150 240,200 220,230 C200,220 190,180 200,150 Z"
                        fill="#f8f8f8"
                        stroke="#ccc"
                        strokeWidth="2"
                    />
                    
                    {/* Legs - extending from hips */}
                    <Path
                        d="M120,340 C110,380 100,430 120,460 C140,450 150,400 140,370 Z
                        M180,340 C190,380 200,430 180,460 C160,450 150,400 160,370 Z"
                        fill="#f8f8f8"
                        stroke="#ccc"
                        strokeWidth="2"
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