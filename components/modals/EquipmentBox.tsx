import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface EquipmentBoxProps {
    visible: boolean;
    onSelect: (type: string) => void;
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
                            <View style={{ paddingVertical: 1, borderWidth: 1, borderColor: '#ff8787' }}>
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => onSelect(item.name)}
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
        borderRadius: 5,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});