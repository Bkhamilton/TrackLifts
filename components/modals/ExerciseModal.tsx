import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { MonoText } from '../StyledText';
import { Text, View } from '../Themed';
import { Exercise } from '../../types';

export default function ExerciseModal({ visible, close, exercise, onDelete }: { visible: boolean, close?: Function, exercise: Exercise, onDelete?: Function }) {
  return (
    <Modal
        visible = {visible}
        transparent = {true}
        animationType = 'fade'
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalPopup}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                  onPress = {close}
              >
                <View>
                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                </View>
              </TouchableOpacity>
              <View style={{ width: 275, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: '600', fontSize: 15 }}>{exercise.title} ({exercise.type})</Text>
              </View>
            </View>
            <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
            <View style={{ paddingTop: 4 }}>
              <Text>{exercise.muscleGroup}</Text>
            </View>
            <View style={{ top: '68%' }}>
              <TouchableOpacity
                onPress={() => onDelete(exercise)}
              >
                <View style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete Exercise</Text>
                </View>
              </TouchableOpacity>
            </View>
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
  },
  separator: {
    marginVertical: 6,
    height: 1,
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    borderRadius: 5,
    paddingVertical: 4,
    backgroundColor: '#ff8787',
    alignItems: 'center',
    justifyContent: 'center',
    top: '70%',
  },
  deleteButtonText: {
    fontSize: 14, 
    fontWeight: '600',
  },
});
