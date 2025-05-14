import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { Muscle } from '@/utils/types'; // Assuming you have a Muscle type
import Slider from '@react-native-community/slider';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface MuscleIntensity {
    muscleId: number;
    muscleName: string;
    intensity: number;
    groupName: string;
}

interface MuscleIntensityModalProps {
    visible: boolean;
    onSave: (muscleIntensities: MuscleIntensity[]) => void;
    close: () => void;
    initialSelection?: MuscleIntensity[];
}

export function MuscleIntensityModal({ visible, onSave, close, initialSelection = []}: MuscleIntensityModalProps) {
    const { muscles } = useContext(DBContext);
    const [selectedMuscles, setSelectedMuscles] = useState<MuscleIntensity[]>(initialSelection);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    // Group muscles by their muscle group
    const groupedMuscles = muscles.reduce((acc, muscle) => {
        const group = muscle.muscleGroup || 'Other';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(muscle);
        return acc;
    }, {} as Record<string, typeof muscles>);

    const handleSelectMuscle = (muscle: Muscle) => {
        // Check if muscle is already selected
        if (selectedMuscles.some(m => m.muscleId === muscle.id)) {
            return;
        }
        
        setSelectedMuscles(prev => [
            ...prev,
            {
                muscleId: muscle.id,
                muscleName: muscle.name,
                intensity: 0.5, // Default value
                groupName: muscle.muscleGroup || 'Other'
            }
        ]);
    };

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const handleIntensityChange = (muscleId: number, value: number) => {
        setSelectedMuscles(prev =>
            prev.map(m =>
                m.muscleId === muscleId ? { ...m, intensity: value } : m
            )
        );
    };

    const removeMuscle = (muscleId: number) => {
        setSelectedMuscles(prev => prev.filter(m => m.muscleId !== muscleId));
    };

    const handleSave = () => {
        onSave(selectedMuscles);
        close();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={close}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <Text style={styles.header}>Select Muscles & Intensities</Text>
                    
                    {/* Muscle Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Available Muscles</Text>
                        <FlatList
                            data={Object.keys(groupedMuscles)}
                            renderItem={({ item: groupName }) => (
                                <View style={styles.groupContainer}>
                                    <TouchableOpacity onPress={() => toggleGroup(groupName)}>
                                        <View style={styles.groupHeader}>
                                            <Text style={styles.groupName}>{groupName}</Text>
                                            <Text>{expandedGroups[groupName] ? '−' : '+'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    
                                    {expandedGroups[groupName] && (
                                        <View style={styles.musclesList}>
                                            {groupedMuscles[groupName].map(muscle => (
                                                <TouchableOpacity
                                                    key={muscle.id}
                                                    onPress={() => handleSelectMuscle(muscle)}
                                                    disabled={selectedMuscles.some(m => m.muscleId === muscle.id)}
                                                >
                                                    <View style={[
                                                        styles.muscleItem,
                                                        selectedMuscles.some(m => m.muscleId === muscle.id) && styles.selectedMuscle
                                                    ]}>
                                                        <Text>{muscle.name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                            keyExtractor={groupName => groupName}
                            contentContainerStyle={styles.listContent}
                        />
                    </View>

                    {/* Selected Muscles with Intensity Sliders */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Selected Muscles</Text>
                        {selectedMuscles.length === 0 ? (
                            <Text style={styles.emptyText}>No muscles selected</Text>
                        ) : (
                            <FlatList
                                data={selectedMuscles}
                                renderItem={({ item }) => (
                                    <View style={styles.selectedMuscleContainer}>
                                        <View style={styles.muscleHeader}>
                                            <View>
                                                <Text style={styles.muscleName}>{item.muscleName}</Text>
                                                <Text style={styles.groupNameSmall}>{item.groupName}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => removeMuscle(item.muscleId)}>
                                                <Text style={styles.removeText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.sliderContainer}>
                                            <Slider
                                                minimumValue={0}
                                                maximumValue={1}
                                                step={0.1}
                                                value={item.intensity}
                                                onValueChange={(value) => handleIntensityChange(item.muscleId, value)}
                                                minimumTrackTintColor="#007AFF"
                                                maximumTrackTintColor="#D3D3D3"
                                            />
                                            <Text style={styles.intensityValue}>{item.intensity.toFixed(1)}</Text>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={item => item.muscleId.toString()}
                            />
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={close} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleSave} 
                            style={[styles.button, styles.saveButton]}
                            disabled={selectedMuscles.length === 0}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPopup: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    listContent: {
        paddingBottom: 10,
    },
    groupContainer: {
        marginBottom: 10,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    groupName: {
        fontWeight: '600',
    },
    groupNameSmall: {
        fontSize: 12,
        color: '#666',
    },
    musclesList: {
        marginLeft: 10,
        marginTop: 5,
    },
    muscleItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 5,
        borderRadius: 5,
    },
    selectedMuscle: {
        backgroundColor: '#f0f0f0',
        borderColor: '#aaa',
    },
    selectedMuscleContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
    muscleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    muscleName: {
        fontWeight: '500',
    },
    removeText: {
        color: 'red',
        fontSize: 18,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    intensityValue: {
        width: 40,
        textAlign: 'right',
        marginLeft: 10,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        padding: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});