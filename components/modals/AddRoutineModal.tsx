import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View, TextInput } from '../Themed';
import { Exercise, Routine, RoutineList } from '../../types';
import { NewExerciseModal } from './NewExerciseModal';
import Database from '../../database/Database';

export default function AddRoutineModal({ visible, close, add }: { visible: boolean, close?: Function, add?: Function }) {
    
  const [newModal, setNewModal] = React.useState( false );
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [index, setIndex] = React.useState(1);

  const [title, setTitle] = React.useState("");

  const db = Database.getInstance();
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    // Load exercise data
    loadData();
  });

  function loadData() {
    db.loadExerciseSortByData("title", (dataArray: React.SetStateAction<never[]>) => 
        setList(dataArray));
  }

  function addRoutine() {
    add({title: title, exercises: exercises});
    clearData();
  }

  function addExerciseModal() {
    setNewModal(true);
  }

  function closeMain() {
    clearData();
    close();
  }

  function clearData() {
    setExercises([]);
    setIndex(1);
    setTitle("");
  }

  function onSelect(props: Exercise) {
    setNewModal(false);
    setIndex(index => index + 1);
    setExercises(exercises => [...exercises, props]);
  }

  function remove(props: Exercise) {
    setIndex(index => index - 1);
    const temp = exercises.filter(exercise => exercise.title == props.title);
    setExercises(temp);
  }

  function ExerciseComponent(props: {
    exercise: Exercise;
  }) {
    return (
      <View style={{ justifyContent: 'space-between', paddingHorizontal: 6, flexDirection: 'row', width: '100%', alignItems: 'center', borderWidth: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{props.exercise.title}</Text>
        <TouchableOpacity
          
        >
          <View style={{ padding: 4, borderWidth: 1, }}>
            <Text style={{ color: '#ff8787' }}>Remove</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  const exerciseComponents = exercises.map(type => <View style={{ paddingTop: 6 }} key={type.id}><ExerciseComponent exercise={type}/></View>)

  return (
    <Modal
        visible = {visible}
        transparent = {true}
        animationType = 'fade'
    >
      <NewExerciseModal visible={newModal} onSelect={onSelect} list={list}></NewExerciseModal>
        <View style={styles.modalContainer}>
          <View style={styles.modalPopup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress = {closeMain}
              >
                <View>
                    <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                </View>
              </TouchableOpacity>
              <View style={{ height: 24, paddingHorizontal: 6 }}>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>New Routine</Text>
              </View>
              <TouchableOpacity
                onPress = {addRoutine}
              >
                <View>
                  <Text style={{ color:'#ff8787' }}>ADD</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10}}>
              <Text style={{fontWeight: '500', fontSize: 16}}>Title</Text>
              <View style={styles.headerContainer}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setTitle}
                  value={title}
                  placeholder="Title Here"
                ></TextInput>
              </View>
            </View>
            <View style={{paddingBottom: 20}}>
              {exerciseComponents}
            </View>
            <View>
              <TouchableOpacity
                onPress={addExerciseModal}
              >
                <View style={styles.addExerciseButton}>
                  <Text style={{fontWeight: '500', fontSize: 16}}>Add Exercise</Text>
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
  addExerciseButton: {
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 4, 
    paddingVertical: 4,
  },
});
