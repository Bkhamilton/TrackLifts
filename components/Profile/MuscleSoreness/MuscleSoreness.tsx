import { loadColor } from '@/utils/muscleLoadModel';
import { useFocusEffect } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useCallback, useContext, useState } from 'react';
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
    
    const { muscleGroupSoreness, muscleLoadStatus, muscleLoadIssues, refreshMuscleLoad } = useContext(DataContext);

    useFocusEffect(useCallback(() => { void refreshMuscleLoad(); }, [refreshMuscleLoad]));

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
        
        return { ...m, value: dbData?.value ?? NaN };
    });
    const getColor = loadColor;

    // Get currently selected muscle data
    const selectedMuscleData = selectedMuscle 
        ? muscleData.find(m => m.id === selectedMuscle) ?? null
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
                    Recent Muscle Load
                </Text>
            </View>
            <View style={{ width: '100%', paddingHorizontal: 16 }}>
                <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
            </View>

            <Text style={{ fontSize: 12, paddingHorizontal: 16, marginBottom: 8 }}>
                Completed-set exposure, weighted by muscle and time. Not measured soreness or readiness.
                {muscleLoadStatus === 'loading' ? ' Loading…' : ''}
                {muscleLoadStatus === 'error' ? ' Unavailable.' : ''}
            </Text>
            {muscleLoadIssues.length > 0 && <Text style={{ fontSize: 12, paddingHorizontal: 16 }}>{muscleLoadIssues.join('. ')}</Text>}
            {muscleLoadStatus === 'error' && <TouchableOpacity onPress={() => void refreshMuscleLoad()}><Text>Retry</Text></TouchableOpacity>}
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
