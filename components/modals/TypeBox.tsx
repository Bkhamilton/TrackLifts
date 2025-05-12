import * as React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

export function TypeBox({visible, onSelect, close} : {visible: boolean, onSelect? : Function, close?: Function}) {
    const list = ["Type", "Barbell", "Dumbbell", "Bodyweight", "Cable", "Machine", "Plate Loaded", "Other"];

    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <FlatList
                        data={list}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 1, borderWidth: 1, borderColor: '#ff8787' }}>
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => onSelect(item)}
                                >
                                    <View style={{ flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
                                        <Text style={{ fontSize: 15 }}>{item}</Text>
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
        width: '40%',
        bottom: '5%',
        right: '18%',
        elevation: 20,
        borderRadius: 5,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});