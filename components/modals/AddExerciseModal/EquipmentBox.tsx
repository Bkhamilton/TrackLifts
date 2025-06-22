import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { Equipment } from '@/utils/types';
import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface EquipmentBoxProps {
    visible: boolean;
    onSelect: (type: Equipment) => void;
    close: () => void;
}

export function EquipmentBox({visible, onSelect, close} : EquipmentBoxProps) {

    const { equipment } = useContext(DBContext);

    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose={() => close()}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <FlatList
                        data={equipment}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 1, borderColor: '#ccc' }}>
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => onSelect(item)}
                                >
                                    <View style={{ flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
                                        <Text style={{ fontSize: 15 }}>{item.name}</Text>
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