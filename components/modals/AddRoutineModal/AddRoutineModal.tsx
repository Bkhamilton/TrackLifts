import { ClearView, Text, TextInput, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { ExerciseContext } from '@/contexts/ExerciseContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
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
    const { exercises } = useContext(ExerciseContext);
    const [title, setTitle] = useState("");

    function addRoutine() {
        add({ title: title, exercises: routineExercises });
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
        setRoutineExercises((routineExercises) => [...routineExercises, props]);
    }

    function remove(props: Exercise) {
        const temp = routineExercises.filter((exercise) => exercise.title !== props.title);
        setRoutineExercises(temp);
    }

    function moveUp(index: number) {
        if (index === 0) return; // Can't move up the first item
        const newExercises = [...routineExercises];
        const temp = newExercises[index];
        newExercises[index] = newExercises[index - 1];
        newExercises[index - 1] = temp;
        setRoutineExercises(newExercises);
    }

    function moveDown(index: number) {
        if (index === routineExercises.length - 1) return; // Can't move down the last item
        const newExercises = [...routineExercises];
        const temp = newExercises[index];
        newExercises[index] = newExercises[index + 1];
        newExercises[index + 1] = temp;
        setRoutineExercises(newExercises);
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
                    <ClearView style={styles.header}>
                        <TouchableOpacity onPress={closeMain} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>New Routine</Text>
                        <TouchableOpacity onPress={addRoutine} style={styles.addButton}>
                            <Text style={styles.addButtonText}>SAVE</Text>
                        </TouchableOpacity>
                    </ClearView>

                    {/* Title Input */}
                    <ClearView style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Routine Title</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setTitle}
                            value={title}
                            placeholder="Enter routine name"
                            placeholderTextColor="#999"
                        />
                    </ClearView>

                    <FlatList
                        data={routineExercises}
                        renderItem={({ item, index }) => (
                            <ExerciseComponent
                                key={item.id}
                                exercise={item}
                                onRemove={remove}
                                onMoveUp={() => moveUp(index)}
                                onMoveDown={() => moveDown(index)}
                                isFirst={index === 0}
                                isLast={index === routineExercises.length - 1}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.exercisesContainer}
                        contentContainerStyle={styles.exercisesContent}
                    />

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
        width: '95%',
        maxHeight: '85%',
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
        backgroundColor: '#f9f9f9',
    },
    exercisesContainer: {
        maxHeight: 240, // Set a maximum height for the exercises list
        marginBottom: 16,
    },
    exercisesContent: {
        flexGrow: 1,
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