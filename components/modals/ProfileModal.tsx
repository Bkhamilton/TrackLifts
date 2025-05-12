import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../Themed';

import userData from '../../data/UserData.json';

interface ProfileModalProps {
    visible: boolean;
    onPress: () => void;
}

export default function ProfileModal({ visible, onPress }: ProfileModalProps) {
        
    return (
        <Modal
            visible = {visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    <TouchableOpacity
                        onPress = {onPress}
                    >
                        <View  style={{position:'absolute', right: 0, borderWidth: 1}}>
                            <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                        </View>
                    </TouchableOpacity>
                    <UserData/>
                </View>
            </View>
        </Modal>
    );

    function UserData() {
        return <View style={{ width: '70%', borderWidth: 1 }}>
            <Text style={{ fontSize: 15 }}>Username: {userData.User['username']}</Text>
            <Text style={{ fontSize: 15 }}>Height: {userData.User['height']}</Text>
            <Text style={{ fontSize: 15 }}>Weight: {userData.User['weight']}</Text>
            <Text style={{ fontSize: 15 }}>Body Fat: {userData.User['body fat']}</Text>
        </View>;
    }
}

const styles = StyleSheet.create({
    modalPopup:{
        width: '90%',
        height: '70%',
        bottom: '5%',
        elevation: 20,
        borderRadius: 20,
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
