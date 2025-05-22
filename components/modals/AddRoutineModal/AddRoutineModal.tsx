import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView, Text, TextInput, View } from '../../Themed';
import { ExerciseComponent } from './ExerciseComponent';
import { NewExerciseModal } from './NewExerciseModal';

interface AddRoutineModalProps {
    visible: boolean;
    close: () => void;
    add: (routine: { title: string; exercises: Exercise[] }) => void;
}

export default function AddRoutineModal({ visible, close, add }: AddRoutineModalProps) {
    const [newModal, setNewModal] = useState(false);
    const [routineExercises, setRoutineExercises] = useState<Exercise[]>([]);
    const { exercises } = useContext(DBContext);
    const [title, setTitle] = useState("");

    function addRoutine() {
        add({title: title, exercises: routineExercises});
        clearData();
    }

    function addExerciseModal() {
        setNewModal(true);
    }

    function closeModal() {
        setNewModal(false);
    }

    function closeMain() {
        clearData();
        close();
    }

    function clearData() {
        setRoutineExercises([]);
        setTitle("");
    }

    function onSelect(props: Exercise) {
        setNewModal(false);
        setRoutineExercises(routineExercises => [...routineExercises, props]);
    }

    function remove(props: Exercise) {
        const temp = routineExercises.filter(exercise => exercise.title == props.title);
        setRoutineExercises(temp);
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <NewExerciseModal 
                visible={newModal} 
                close={closeModal}
                onSelect={onSelect}
                exercises={exercises}
            />
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={closeMain} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>New Routine</Text>
                        <TouchableOpacity onPress={addRoutine} style={styles.addButton}>
                            <Text style={styles.addButtonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Routine Title</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setTitle}
                            value={title}
                            placeholder="Enter routine name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Exercises List */}
                    <ScrollView style={styles.exercisesContainer} contentContainerStyle={styles.exercisesContent}>
                        {routineExercises.length > 0 ? (
                            routineExercises.map((exercise) => (
                                <ExerciseComponent 
                                    key={exercise.id}
                                    exercise={exercise} 
                                    onRemove={remove} 
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No exercises added yet</Text>
                        )}
                    </ScrollView>

                    {/* Add Exercise Button */}
                    <TouchableOpacity onPress={addExerciseModal} style={styles.addExerciseButton}>
                        <MaterialCommunityIcons name="plus" size={20} color="#ff8787" />
                        <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
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
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    addButtonText: {
        color: '#ff8787',
        fontWeight: '600',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    exercisesContainer: {
        maxHeight: 200, // Set a maximum height for the exercises list
        marginBottom: 16,
    },
    exercisesContent: {
        paddingBottom: 8, // Optional: Add padding to the content inside the ScrollView
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 16,
    },
    addExerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff8787',
        backgroundColor: '#fff5f5',
    },
    addExerciseButtonText: {
        color: '#ff8787',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});