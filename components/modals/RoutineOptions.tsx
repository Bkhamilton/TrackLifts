import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Routine } from '@/utils/types';
import { Text, View } from '../Themed';

interface RoutineOptionsProps {
    visible: boolean;
    close: () => void;
    routine: Routine;
    onDelete: (id: number) => void;
}

export default function RoutineOptions({ visible, close, routine, onDelete }: RoutineOptionsProps) {
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
                        <TouchableOpacity
                            onPress = {close}
                        >
                            <View>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 24, paddingHorizontal: 6, left: 60 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700' }}>{routine.title}</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <View style={styles.optionButtons}>
                                <Text style={styles.optionText}>Edit Routine</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => onDelete(routine.id)}
                        >
                            <View style={styles.optionButtons}>
                                <Text style={styles.optionText}>Delete Routine</Text>
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
        width: '70%',
        bottom: '10%',
        elevation: 30,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 8,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionButtons: {
        alignItems: 'center',
        paddingVertical: 2,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    } 
});
