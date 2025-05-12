import * as React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

interface MuscleGroupBoxProps {
    visible: boolean;
    onSelect: (item: string) => void;
    close: () => void;
}

export function MuscleGroupBox({visible, onSelect, close} : MuscleGroupBoxProps) {
    const list = ["Muscle Group", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core"]

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
                            <View style={{ paddingVertical: 1, }}>
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => onSelect(item)}
                                >
                                    <View style={{ flexDirection: 'row', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
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
        width: '45%',
        bottom: '5%',
        left: '18%',
        elevation: 20,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});