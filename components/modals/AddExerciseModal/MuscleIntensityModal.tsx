import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { Muscle } from '@/utils/types';
import Slider from '@react-native-community/slider';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { MuscleSelectionModal } from './MuscleSelectionModal'; // Import the new component

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
    const [showMuscleSelection, setShowMuscleSelection] = useState(false);

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
        setShowMuscleSelection(false);
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
        <>
            {/* Main Modal */}
            <Modal
                visible={visible && !showMuscleSelection}
                transparent={true}
                animationType='fade'
                onRequestClose={close}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalPopup}>
                            <Text style={styles.header}>Select Muscles & Intensities</Text>
                            
                            {/* Add Muscle Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    setShowMuscleSelection(true);
                                }}
                                style={styles.addMuscleButton}
                            >
                                <Text style={styles.addMuscleButtonText}>+ Add Muscles</Text>
                            </TouchableOpacity>

                            {/* Selected Muscles with Intensity Sliders */}
                            <View style={styles.section}>
                                {selectedMuscles.length === 0 ? (
                                    <Text style={styles.emptyText}>No muscles selected yet</Text>
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
                                                    <TouchableOpacity 
                                                        onPress={() => removeMuscle(item.muscleId)}
                                                        style={styles.removeButton}
                                                    >
                                                        <Text style={styles.removeText}>✕</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.sliderContainer}>
                                                    <Slider
                                                        style={styles.slider}
                                                        minimumValue={0}
                                                        maximumValue={1}
                                                        step={0.1}
                                                        value={item.intensity}
                                                        onValueChange={(value) => handleIntensityChange(item.muscleId, value)}
                                                        minimumTrackTintColor="#ff8787"
                                                        maximumTrackTintColor="#D3D3D3"
                                                        thumbTintColor="#ff8787"
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
                                <TouchableOpacity 
                                    onPress={close} 
                                    style={[styles.button, styles.cancelButton]}
                                >
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
                </View>
            </Modal>

            {/* Muscle Selection Modal */}
            <MuscleSelectionModal
                visible={showMuscleSelection}
                groupedMuscles={groupedMuscles}
                selectedMuscles={selectedMuscles}
                onSelectMuscle={handleSelectMuscle}
                onClose={() => setShowMuscleSelection(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    // Main Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
    },
    modalPopup: {
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    addMuscleButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    addMuscleButtonText: {
        color: '#ff8787',
        fontWeight: '500',
    },
    section: {
        marginBottom: 15,
    },
    selectedMuscleContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
    },
    muscleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    muscleName: {
        fontWeight: '500',
        fontSize: 15,
        color: '#333',
    },
    groupNameSmall: {
        fontSize: 12,
        color: '#666',
    },
    removeButton: {
        padding: 4,
    },
    removeText: {
        color: '#ff4444',
        fontSize: 18,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        height: 40,
    },
    intensityValue: {
        width: 40,
        textAlign: 'center',
        marginLeft: 10,
        fontWeight: '600',
        color: '#ff8787',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        padding: 10,
        fontStyle: 'italic',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    saveButton: {
        backgroundColor: '#ff8787',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },

    // Muscle Selection Modal Styles
    muscleModalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    muscleModalContainer: {
        width: '90%',
        maxHeight: '80%',
    },
    muscleModalPopup: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    muscleModalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    muscleGroupContainer: {
        marginBottom: 15,
    },
    muscleGroupHeader: {
        fontWeight: '600',
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        paddingLeft: 8,
    },
    muscleList: {
        marginLeft: 8,
    },
    muscleItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 8,
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
    },
    selectedMuscle: {
        backgroundColor: '#e0e0e0',
        borderColor: '#aaa',
    },
    muscleItemText: {
        color: '#333',
    },
    muscleListContent: {
        paddingBottom: 10,
    },
});