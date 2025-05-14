import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, View } from '../../Themed';
import { ExerciseComponent } from './ExerciseComponent';
import { NewExerciseModal } from './NewExerciseModal';

interface AddRoutineModalProps {
    visible: boolean;
    close: () => void;
    add: (routine: { title: string; exercises: Exercise[] }) => void;
}

export default function AddRoutineModal({ visible, close, add }: AddRoutineModalProps) {
    
    const [newModal, setNewModal] = useState( false );
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
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <NewExerciseModal 
                visible={newModal} 
                close={closeModal}
                onSelect={onSelect}
                exercises={exercises}
            />
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress = {closeMain}
                        >
                            <View>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </View>
                        </TouchableOpacity>
                            <View style={{ height: 24, paddingHorizontal: 6 }}>
                                <Text style={{ fontSize: 17, fontWeight: '600' }}>New Routine</Text>
                            </View>
                        <TouchableOpacity
                            onPress = {addRoutine}
                        >
                            <View>
                                <Text style={{ color:'#ff8787' }}>ADD</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10}}>
                        <Text style={{fontWeight: '500', fontSize: 16}}>Title</Text>
                        <View style={styles.headerContainer}>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={setTitle}
                                value={title}
                                placeholder="Title Here"
                            ></TextInput>
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}}>
                        {
                            routineExercises.map(type => (
                                <View style={{ paddingVertical: 2 }} key={type.id}>
                                    <ExerciseComponent 
                                        exercise={type} 
                                        onRemove={remove} 
                                    />
                                </View>
                            ))
                        }
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={addExerciseModal}
                        >
                            <View style={styles.addExerciseButton}>
                                <Text style={{fontWeight: '500', fontSize: 16}}>Add Exercise</Text>
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
    textInput: {
        borderWidth: 1, 
        height: 40, 
        padding: 10,
    },
    headerContainer: {
        width: '80%', 
        paddingLeft: 10
    },
    addExerciseButton: {
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 4, 
        paddingVertical: 4,
    },
});
