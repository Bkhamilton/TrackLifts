import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import AddToWorkoutModal from './AddToWorkoutModal';

type GraphType =
    | 'Top Set'
    | 'Heaviest Set'
    | 'Most Weight Moved'
    | 'Average Weight'
    | 'Most Repetitions';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (exercise: Exercise, graphType: GraphType) => void;
}

const graphTypes: GraphType[] = [
    'Top Set',
    'Heaviest Set',
    'Most Weight Moved',
    'Average Weight',
    'Most Repetitions',
];

const FavoriteGraphModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
    const [selectedGraphType, setSelectedGraphType] = useState<GraphType>('Top Set');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showGraphTypeModal, setShowGraphTypeModal] = useState(false);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add Favorite Graph</Text>
                    
                    <Text style={styles.sectionTitle}>Select Graph Type</Text>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                        ]}
                        onPress={() => setShowGraphTypeModal(true)}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedGraphType && styles.selectedOptionText,
                        ]}>
                            {selectedGraphType}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color="#868e96" />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Select Exercise</Text>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedExercise && styles.selectedOption,
                            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                        ]}
                        onPress={() => setShowExerciseModal(true)}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedExercise && styles.selectedOptionText,
                        ]}>
                            {selectedExercise ? selectedExercise.title : 'Select Exercise'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color="#868e96" />
                    </TouchableOpacity>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!selectedExercise || !selectedGraphType) && { opacity: 0.5 }
                            ]}
                            disabled={!selectedExercise}
                            onPress={() => {
                                if (selectedExercise && selectedGraphType) {
                                    onSave(selectedExercise, selectedGraphType);
                                }
                            }}
                        >
                            <MaterialCommunityIcons name="star-plus" size={20} color="#fff" />
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Graph Type Modal */}
                <Modal
                    visible={showGraphTypeModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowGraphTypeModal(false)}
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPressOut={() => setShowGraphTypeModal(false)}
                    >
                        <View style={[styles.modalContent, { padding: 12, marginTop: 100 }]}>
                            <Text style={styles.sectionTitle}>Select Graph Type</Text>
                            {graphTypes.map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.option,
                                        selectedGraphType === type && styles.selectedOption,
                                    ]}
                                    onPress={() => {
                                        setSelectedGraphType(type);
                                        setShowGraphTypeModal(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        selectedGraphType === type && styles.selectedOptionText,
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Exercise Modal */}
                <AddToWorkoutModal
                    visible={showExerciseModal}
                    close={() => setShowExerciseModal(false)}
                    add={(exercise) => {
                        setSelectedExercise(exercise);
                        setShowExerciseModal(false);
                    }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: 14,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    selectedOption: {
        backgroundColor: '#ffe3e3',
    },
    optionText: {
        fontSize: 15,
    },
    selectedOptionText: {
        color: '#ff8787',
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 18,
    },
    cancelButton: {
        marginRight: 16,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    cancelText: {
        color: '#868e96',
        fontWeight: '600',
        fontSize: 15,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    saveText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        marginLeft: 6,
    },
});

export default FavoriteGraphModal;