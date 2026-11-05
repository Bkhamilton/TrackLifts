import { Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BodyDiagram from './BodyDiagram';
import MuscleInfoPanel from './MuscleInfoPanel';
import SorenessLegend from './SorenessLegend';

type MuscleGroup = {
  id: string;
  name: string;
  value: number;
  description: string;
  exercises: string[];
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
        
        if (!dbData) return { ...m, value: 0, rawScore: 0, maxSoreness: 1, weightedSoreness: 0 };
        
        // Use weighted soreness if available, otherwise fall back to normalized raw soreness
        const weightedSoreness = dbData.weighted_soreness !== undefined ? dbData.weighted_soreness : 0;
        const rawScore = dbData.soreness_score || 0;
        const maxSoreness = dbData.max_soreness || 1;
        
        // Enhanced normalization function for display
        const linear = weightedSoreness;
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
            maxSoreness,
            weightedSoreness
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
                    <BodyDiagram
                        view={view}
                        muscleData={muscleData}
                        selectedMuscle={selectedMuscle}
                        getColor={getColor}
                    />
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
