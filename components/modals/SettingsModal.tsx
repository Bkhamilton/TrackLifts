import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { MonoText } from '../StyledText';
import { Text, View } from '../Themed';

export default function SettingsModal({ visible, onPress }: { visible: boolean, onPress?: Function }) {
    
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
              <View>
                  <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
              </View>
              </TouchableOpacity>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalPopup:{
    width: '90%',
    height: '60%',
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
