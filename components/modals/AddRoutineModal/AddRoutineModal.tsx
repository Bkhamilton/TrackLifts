import { ClearView, Text, TextInput, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { ExerciseComponent } from './ExerciseComponent';
import { NewExerciseModal } from './NewExerciseModal';

interface AddRoutineModalProps {
    visible: boolean;
    close: () => void;
    add: (routine: { title: string; exercises: Exercise[] }) => void;
}

type Position = {
    y: number;
    originalIndex: number;
};

export default function AddRoutineModal({ visible, close, add }: AddRoutineModalProps) {
    const [newModal, setNewModal] = useState(false);
    const [routineExercises, setRoutineExercises] = useState<Exercise[]>([]);
    const { exercises } = useContext(DBContext);
    const [title, setTitle] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const positions = useSharedValue<Position[]>([]);

    useEffect(() => {
        positions.value = routineExercises.map((_, index) => ({
            y: index * 60,
            originalIndex: index,
        }));
    }, [routineExercises]);

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
        setRoutineExercises((routineExercises) => {
            const newExercises = [...routineExercises, props];
            positions.value = newExercises.map((_, index) => ({
                y: index * 60,
                originalIndex: index,
            }));
            return newExercises;
        });
    }

    function remove(props: Exercise) {
        const temp = routineExercises.filter((exercise) => exercise.title !== props.title);
        setRoutineExercises(temp);
    }

    function handleDragEnd() {
        setIsDragging(false);
        // Update the actual exercises array based on new positions
        const newExercises = [...routineExercises];
        const newOrder = positions.value
            .map((item, index) => ({ ...item, originalIndex: index }))
            .sort((a, b) => a.y - b.y)
            .map((item) => newExercises[item.originalIndex]);

        setRoutineExercises(newOrder);
    }

    function handleLongPress() {
        setIsDragging(true);
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
            <GestureHandlerRootView style={{ flex: 1 }}>
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
            </GestureHandlerRootView>
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