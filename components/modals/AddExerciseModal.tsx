import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import { Text, View, TextInput } from '../Themed';
import { TypeBox } from './TypeBox';
import { MuscleGroupBox } from './MuscleGroupBox';

export default function AddExerciseModal({ visible, close, add }: { visible: boolean, close?: Function, add?: Function }) {

  const [title, setTitle] = React.useState("");
  const [typeBox, setTypeBox] = React.useState("Type");
  const [muscleGroupBox, setMuscleGroupBox] = React.useState("Muscle Group");

  const [showTypeBox, setShowTypeBox] = React.useState( false );
  const [showMGBox, setShowMGBox] = React.useState( false );

  function addExercise() {
    if (title != '' && typeBox != "Type" && muscleGroupBox != "Muscle Group") {
      add({title: title, type: typeBox, muscleGroup: muscleGroupBox});
      setTitle("");
      setTypeBox("Type");
      setMuscleGroupBox("Muscle Group");
    }
  }

  function clearBoxes() {
    setTitle("")
    setTypeBox("Type");
    setMuscleGroupBox("Muscle Group");
    close();
  }

  function chooseType(props) {
    setTypeBox(props);
    setShowTypeBox(false);
  }

  function chooseMuscleGroup(props) {
    setMuscleGroupBox(props);
    setShowMGBox(false); 
  }

  function closeTypeBox() {
    setShowTypeBox(false);
  }

  function closeMGBox() {
    setShowMGBox(false);
  }

  function openTypeBox() {
    setShowTypeBox(true);
  }

  function openMGBox() {
    setShowMGBox(true);
  }

  return (
    <Modal
        visible = {visible}
        transparent = {true}
        animationType = 'fade'
    >
      <TypeBox visible={showTypeBox} onSelect={chooseType} close={closeTypeBox}></TypeBox>
      <MuscleGroupBox visible={showMGBox} onSelect={chooseMuscleGroup} close={closeMGBox}></MuscleGroupBox>
        <View style={styles.modalContainer}>
          <View style={styles.modalPopup}>
            <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
              <TouchableOpacity
                    onPress = {clearBoxes}
              >
                <View>
                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                </View>
              </TouchableOpacity>
              <View style={{ height: 24, paddingHorizontal: 6, left: 60 }}>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>Add New Exercise</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Title</Text>
              <View style={styles.headerContainer}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setTitle}
                    value={title}
                    placeholder="Title Here"
                ></TextInput>
              </View>
            </View>
            <View style={styles.sortButtonsContainer}>
              <TouchableOpacity
                onPress={openTypeBox}
              >
                <View style={[styles.sortButtons, { right: 1 }]}>
                  <Text style={{ fontWeight: (typeBox != "Type") ? '600': '400' }}>{typeBox}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openMGBox}
              >
                <View style={[styles.sortButtons, { left: 1 }]}>
                  <Text style={{ fontWeight: (muscleGroupBox != "Muscle Group") ? '600' : '400' }}>{muscleGroupBox}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: 8 }}>
              <TouchableOpacity
                  onPress = {addExercise}
              >
                <View style={{ borderWidth: 1, alignItems: 'center', borderRadius: 4 }}>
                    <Text>GO</Text>
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
  textInput: {
    borderWidth: 1, 
    height: 40, 
    padding: 10,
  },
  headerContainer: {
    width: '80%', 
    paddingLeft: 10
  },
  sortButtons: {
    borderWidth: 1,
    width: 158,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 4,
  },
  sortButtonsContainer: {
    flexDirection: "row" , 
    justifyContent: 'space-evenly', 
    paddingTop: 3,
  }
});
