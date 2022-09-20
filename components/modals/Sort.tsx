import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View, TextInput } from '../Themed';

export default function Sort({ visible, close, list, onSelect }: { visible: boolean, close?: Function, list: string[], onSelect?: Function }) {
    
  return (
    <Modal
        visible = {visible}
        transparent = {true}
        animationType = 'fade'
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalPopup}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                    onPress = {close}
              >
                <View>
                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                </View>
              </TouchableOpacity>
              <View style={{ height: 24, paddingHorizontal: 6, left: 60 }}>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>Sort</Text>
              </View>
            </View>
            <FlatList
              data={list}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 4, }}>
                  <TouchableOpacity
                    key={item}
                  >
                    <View style={{ borderWidth: 1, paddingVertical: 4, paddingHorizontal: 3, }}>
                      <Text style={{ fontSize: 16 }}>{item}</Text>
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
    elevation: 30,
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
