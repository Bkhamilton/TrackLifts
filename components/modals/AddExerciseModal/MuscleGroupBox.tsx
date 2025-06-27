import { Text, View } from '@/components/Themed';
import { MuscleGroup } from '@/constants/types';
import { DBContext } from '@/contexts/DBContext';
import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface MuscleGroupBoxProps {
    visible: boolean;
    onSelect: (item: MuscleGroup) => void;
    close: () => void;
}

export function MuscleGroupBox({visible, onSelect, close} : MuscleGroupBoxProps) {

    const { muscleGroups } = useContext(DBContext);

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
                        data={muscleGroups}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 1, borderColor: '#ccc' }}>
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => onSelect(item)}
                                >
                                    <View style={{ flexDirection: 'row',paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
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