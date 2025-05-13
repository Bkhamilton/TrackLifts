import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Exercise, Routine } from '@/utils/types';
import { Text, View } from '../Themed';

interface RoutineModalProps {
    visible: boolean;
    close: () => void;
    start: (routine: Routine) => void;
    routine: Routine;
}

export default function RoutineModal({ visible, close, start, routine }: RoutineModalProps) {

    function ExerciseHeader(props: Exercise) {
        return (
            <View>
                <Text>{props.title} ({props.equipment})</Text>
            </View>
        )
    }
    
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress = {close}
                        >
                            <View>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>{routine.title}</Text>
                    </View>
                    <View>
                        {
                            routine.exercises.map((type, index) => (
                                <View style={{ paddingVertical: 2 }} key={index}>
                                    <ExerciseHeader 
                                        id={type.id} 
                                        title={type.title} 
                                        muscleGroup={type.muscleGroup} 
                                        muscleGroupId={type.muscleGroupId}
                                        equipment={type.equipment}
                                    />
                                </View>
                            ))
                        }
                        <TouchableOpacity
                            style = {{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => start(routine)}
                        >
                            <View style = {styles.workoutButton}>
                                <Text style={styles.workoutButtonText}>GO</Text>
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
        borderRadius: 4,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    workoutButton: {
        width:'100%',
        top: 8,
        height: 28,
        borderRadius: 5,
        backgroundColor: '#ff8787',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workoutButtonText: {
        fontSize: 12, 
        fontWeight: '600',
    },
    titleContainer: {
        width: 190, 
        alignItems: 'center', 
        position: 'absolute', 
        left: 80, 
        top: 15,
    },
    titleText: {
        fontWeight: '500', 
        fontSize: 15,
    }
});
