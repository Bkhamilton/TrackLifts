import { Text, TextInput, View } from '@/components/Themed';
import { Equipment, MuscleGroup } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { EquipmentBox } from './EquipmentBox';
import { MuscleGroupBox } from './MuscleGroupBox';
import { MuscleIntensityModal } from './MuscleIntensityModal';

interface AddExerciseModalProps {
    visible: boolean;
    close: () => void;
    add: (exercise: {
        title: string;
        equipment: Equipment;
        muscleGroup: MuscleGroup;
        muscleIntensities: any[];
    }) => void;
}

export default function AddExerciseModal({ visible, close, add }: AddExerciseModalProps) {
    const [title, setTitle] = useState("");
    const [equipmentBox, setEquipmentBox] = useState<Equipment>({ id: 0, name: "Equipment" });
    const [muscleGroupBox, setMuscleGroupBox] = useState<MuscleGroup>({ id: 0, name: "Muscle Group" });
    const [muscleIntensities, setMuscleIntensities] = useState<any[]>([]);

    const [showEquipmentBox, setShowEquipmentBox] = useState(false);
    const [showMGBox, setShowMGBox] = useState(false);
    const [showIntensityBox, setShowIntensityBox] = useState(false);

    function addExercise() {
        if (title != '' && equipmentBox.name != "Equipment" && muscleGroupBox.name != "Muscle Group") {
            add({
                title: title, 
                equipment: equipmentBox, 
                muscleGroup: muscleGroupBox,
                muscleIntensities: muscleIntensities
            });
            setTitle("");
            setEquipmentBox({ id: 0, name: "Equipment" });
            setMuscleGroupBox({ id: 0, name: "Muscle Group" });
            setMuscleIntensities([]);
        }
    }

    function clearBoxes() {
        setTitle("");
        setEquipmentBox({ id: 0, name: "Equipment" });
        setMuscleGroupBox({ id: 0, name: "Muscle Group" });
        setMuscleIntensities([]);
        close();
    }

    const handleSaveMuscleIntensities = (intensities: any[]) => {
        setMuscleIntensities(intensities);
        setShowIntensityBox(false);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <MuscleIntensityModal 
                visible={showIntensityBox} 
                close={() => setShowIntensityBox(false)}
                onSave={handleSaveMuscleIntensities}
                initialSelection={muscleIntensities}
            />
            <EquipmentBox 
                visible={showEquipmentBox} 
                onSelect={(equipment) => {
                    setEquipmentBox(equipment);
                    setShowEquipmentBox(false);
                }} 
                close={() => setShowEquipmentBox(false)}
            />
            <MuscleGroupBox 
                visible={showMGBox} 
                onSelect={(muscleGroup) => {
                    setMuscleGroupBox(muscleGroup);
                    setShowMGBox(false);
                }} 
                close={() => setShowMGBox(false)}
            />
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Add New Exercise</Text>
                        <TouchableOpacity onPress={clearBoxes} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Exercise Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTitle}
                            value={title}
                            placeholder="Enter exercise name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Equipment and Muscle Group Row */}
                    <View style={styles.row}>
                        <View style={styles.selectContainer}>
                            <Text style={styles.label}>Equipment</Text>
                            <TouchableOpacity 
                                onPress={() => setShowEquipmentBox(true)}
                                style={styles.selectButton}
                            >
                                <Text style={[
                                    styles.selectButtonText,
                                    equipmentBox.name !== "Equipment" && styles.selectedText
                                ]}>
                                    {equipmentBox.name}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectContainer}>
                            <Text style={styles.label}>Muscle Group</Text>
                            <TouchableOpacity 
                                onPress={() => setShowMGBox(true)}
                                style={styles.selectButton}
                            >
                                <Text style={[
                                    styles.selectButtonText,
                                    muscleGroupBox.name !== "Muscle Group" && styles.selectedText
                                ]}>
                                    {muscleGroupBox.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Muscle Intensity Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Muscle Intensities</Text>
                        <TouchableOpacity 
                            onPress={() => setShowIntensityBox(true)}
                            style={styles.intensityButton}
                        >
                            <Text style={styles.intensityButtonText}>
                                {muscleIntensities.length > 0 
                                    ? `${muscleIntensities.length} muscle(s) selected`
                                    : "Select muscles and intensities"}
                            </Text>
                        </TouchableOpacity>
                        
                        {muscleIntensities.length > 0 && (
                            <View style={styles.intensityList}>
                                {muscleIntensities.map((item, index) => (
                                    <View key={index} style={styles.intensityItem}>
                                        <Text style={styles.muscleName}>{item.muscleName}</Text>
                                        <Text style={styles.intensityValue}>{item.intensity.toFixed(1)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={addExercise}
                        style={styles.submitButton}
                        disabled={title === '' || equipmentBox.name === "Equipment" || muscleGroupBox.name === "Muscle Group"}
                    >
                        <Text style={styles.submitButtonText}>Create Exercise</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 20,
    },
    modalPopup: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    selectContainer: {
        width: '48%',
    },
    selectButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#999',
    },
    selectedText: {
        color: '#333',
        fontWeight: '500',
    },
    section: {
        marginBottom: 20,
    },
    intensityButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    intensityButtonText: {
        fontSize: 16,
        color: '#666',
    },
    intensityList: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 8,
    },
    intensityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    muscleName: {
        fontSize: 14,
        color: '#444',
    },
    intensityValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff8787',
    },
    submitButton: {
        backgroundColor: '#ff8787',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        opacity: 1,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});