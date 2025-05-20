import { DBContext } from '@/contexts/DBContext';
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

interface AddToWorkoutModalProps {
    visible: boolean;
    close: () => void;
    add: (props: Exercise) => void;
}

export default function AddToWorkoutModal({ visible, close, add }: AddToWorkoutModalProps) {
    const { exercises } = useContext(DBContext);
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <TouchableOpacity
                        onPress = {close}
                    >
                        <View>
                            <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        data={exercises}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 4 }}>
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => add(item)}
                                >
                                    <View style={{ borderWidth: 1, paddingVertical: 4 }}>
                                        <Text style={{ fontSize: 16 }}>{item.title} ({item.equipment})</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalPopup:{
        width: '90%',
        height: '40%',
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
});
