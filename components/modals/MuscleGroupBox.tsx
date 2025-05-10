import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View, TextInput } from '../Themed';
import { Exercise, Routine, RoutineInfo } from '../../types';


export function MuscleGroupBox({visible, onSelect, close} : {visible: boolean, onSelect? : Function, close?: Function}) {
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