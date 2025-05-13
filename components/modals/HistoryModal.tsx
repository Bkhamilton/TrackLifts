import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../Themed';

interface HistoryModalProps {
    visible: boolean;
    close: () => void;
    routine: {
        id: number;
        title: string;
        exercises: any[];
    };
}

export default function HistoryModal({ visible, close, routine } : HistoryModalProps) {
    
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
                    <Text>
                        {JSON.stringify(routine)}
                    </Text>
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
