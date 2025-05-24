import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Exercise } from '@/utils/types';
import { Text, View } from '../../Themed';
import DataTab from './DataTab';
import MusclesTab from './MusclesTab';

interface ExerciseModalProps {
    visible: boolean;
    close: () => void;
    exercise: Exercise;
    onDelete: (exerciseId: number) => void;
}

export default function ExerciseModal({ visible, close, exercise, onDelete }: ExerciseModalProps) {
    const [selectedTab, setSelectedTab] = useState<'Muscles' | 'Data'>('Muscles');

    const renderTabContent = () => {
        if (selectedTab === 'Muscles') {
            return <MusclesTab exercise={exercise} />;
        } else {
            return <DataTab />;
        }
    };

    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <View style={[styles.row, styles.alignCenter]}>
                        <TouchableOpacity onPress={close}>
                            <View>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{exercise.title} ({exercise.equipment})</Text>
                        </View>
                    </View>
                    <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
                    <View style={styles.muscleDataContainer}>
                        <TouchableOpacity
                            style={[
                                styles.flexCenter,
                                styles.dataTypeButton,
                                selectedTab === 'Muscles' && styles.selectedButton, // Highlight if selected
                            ]}
                            onPress={() => setSelectedTab('Muscles')} // Set tab to 'Muscles'
                        >
                            <Text
                                style={[
                                    styles.muscleDataText,
                                    selectedTab === 'Muscles' && styles.selectedText, // Bold if selected
                                ]}
                            >
                                Muscles
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.flexCenter,
                                styles.dataTypeButton,
                                selectedTab === 'Data' && styles.selectedButton, // Highlight if selected
                            ]}
                            onPress={() => setSelectedTab('Data')} // Set tab to 'Data'
                        >
                            <Text
                                style={[
                                    styles.muscleDataText,
                                    selectedTab === 'Data' && styles.selectedText, // Bold if selected
                                ]}
                            >
                                Data
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.paddingTop}>
                        <Text>{exercise.muscleGroup}</Text>
                    </View>
                    <View style={styles.paddingTop}>
                        {renderTabContent()}
                    </View>
                    <View style={styles.paddingTopLarge}>
                        <TouchableOpacity onPress={() => onDelete(exercise.id)}>
                            <View style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Delete Exercise</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalPopup:{
        width: '90%',
        bottom: '5%',
        elevation: 20,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        marginVertical: 6,
        height: 1,
        width: '100%',
        alignItems: 'center',
    },
    deleteButton: {
        borderRadius: 5,
        paddingVertical: 4,
        backgroundColor: '#ff8787',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        fontSize: 14, 
        fontWeight: '600',
    },
    musclesContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
    },
    musclesHeader: {
        fontWeight: '500',
        marginBottom: 8,
    },
    muscleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    muscleName: {
        width: 120,
        fontSize: 14,
    },
    intensityBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    intensityBar: {
        height: '100%',
        backgroundColor: '#ff8787',
        borderRadius: 3,
        marginRight: 8,
    },
    intensityValue: {
        position: 'absolute',
        right: 8,
    },
    row: {
        flexDirection: 'row',
    },
    alignCenter: {
        alignItems: 'center',
    },
    titleContainer: {
        width: 275,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: '600',
        fontSize: 15,
    },
    muscleDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
        marginHorizontal: '20%',
    },
    flexCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    muscleDataText: {
        fontWeight: '500',
        fontSize: 15,
    },
    paddingLeft: {
        paddingLeft: 8,
    },
    paddingTop: {
        paddingTop: 4,
    },
    paddingTopLarge: {
        paddingTop: 16,
    },
    dataTypeButton: {
        borderRadius: 5,
        paddingVertical: 4,
    },
    selectedButton: {
        backgroundColor: '#ff8787', // Highlighted background color
    },
    selectedText: {
        fontWeight: 'bold', // Bold text for selected tab
        color: 'white', // Optional: Change text color for better contrast
    },
});
