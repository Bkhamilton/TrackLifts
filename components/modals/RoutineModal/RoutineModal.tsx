import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { ScrollView, Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import ExerciseHeader from './ExerciseHeader'; // Import ExerciseHeader

interface RoutineModalProps {
    visible: boolean;
    close: () => void;
    start: (routine: ActiveRoutine) => void;
    routine: ActiveRoutine;
}

export default function RoutineModal({ visible, close, start, routine }: RoutineModalProps) {
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <ScrollView style={{ paddingVertical: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress = {close}
                            >
                                <View>
                                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.titleText}>{routine.title}</Text>
                        </View>
                        <View>
                            {
                                routine.exercises.map((type, index) => (
                                    <View style={{ paddingVertical: 2 }} key={index}>
                                        <ExerciseHeader 
                                            exercise = {type}
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
                    </ScrollView>
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
        alignItems: 'center', 
        marginBottom: 10
    },
    titleText: {
        fontWeight: '500', 
        fontSize: 15,
    }
});
