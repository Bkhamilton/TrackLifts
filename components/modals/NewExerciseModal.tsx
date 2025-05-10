import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View, TextInput } from '../Themed';
import { Exercise, Routine, RoutineInfo } from '../../types';
import Database from '../../database/Database';


export function NewExerciseModal({visible, onSelect, list} : {visible: boolean, onSelect? : Function, list: Exercise[]}) {
    return (
      <Modal
        visible = {visible}
        transparent = {true}
        animationType = 'fade'
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalPopup}>
            <View style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 4}}>
                <Text style={{fontSize: 16, fontWeight: '600'}}>Add Exercise</Text>
            </View>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 4, }}>
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelect(item)}
                >
                  <View style={{ flexDirection: 'row', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: 12 }}>{item.title} ({item.type})</Text>
                    <View>
                      <Text style={{ fontWeight: '500', fontSize: 15}}>{item.muscleGroup}</Text>
                    </View>
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
    }
});