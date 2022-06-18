import React, { useState } from 'react';
import { Text, TextInput, View, SafeAreaView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { AlphabetList } from "react-native-section-alphabet-list";

const data = [
  { value: "Bench Press (Barbell)", key: '00001' },
  { value: "Bench Press (Dumbbell)", key: '00002' },
  { value: "Pull Up", key: '00003' },
  { value: "Leg Press", key: '00004' },
  { value: 'Romanian Deadlift (Dumbbell)', key: '00005' },
  { value: 'Incline Curl (Dumbbell)', key: '00006' },
  { value: "Hanging Knee Raises", key: '00007' },
  { value: "Push Up", key: '00008' },
  { value: "Tricep Dip", key: '00009' },
  { value: "Lat Pulldown (Wide Grip)", key: '00010' },
  { value: "Calf Raise (Machine)", key: '00011' },
  { value: "Decline Bench Press (Barbell)", key: '00012' },
  { value: "Face Pull (Cable)", key: '00013' },
  { value: "Hip Thrust (Barbell)", key: '00014' },
  { value: "High-Low Chest Fly", key: '00015' },
  { value: "Lever Row", key: '00016' },
  { value: "Seated Leg Curl (Machine)", key: '00017' },
  { value: "Overhead Press (Dumbbell)", key: '00018' },
  { value: "Lateral Raise (Dumbbell)", key: '00019' }
]

function Exercises() {
  const [text, setText] = useState('')
  const [exerciseList, setList] = useState(data) 
  const [toAdd, setToAdd] = useState('')
  const [curKey, setcurKey] = useState('00020')
  const [showModal, setShowModal] = useState(false)

  const addToList = () => {
    if (toAdd == '') {

    } else {
      const newList = exerciseList.concat({value: toAdd, key: curKey})
      setList(newList)
      setcurKey('00021')
      setToAdd('')
    }
    setShowModal(false)
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}> 
        <Text style={styles.titleText}>Exercises</Text>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible = {showModal}
      >
        <View style={styles.newExerciseModal}>
          <View style={styles.backgroundBlur}></View>
          <View style = {[styles.modalContainer]}>
            <View style = {styles.sameLine}>
              <Text>NAME</Text>
              <TextInput
                style={{borderWidth: 1, borderRadius: 5, height: 30, width: '70%'}}
                placeholder="Exercise Name"
                onChangeText={newText => setToAdd(newText)}
                defaultValue={toAdd}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 28,
                position: 'absolute',
                left:8,
                bottom:20,
              }}
              onPress = {() => setShowModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width:28,
                position: 'absolute',
                right: 8,
                bottom: 20,
              }}
              onPress = {addToList}
            >
              <View><Text style={{color:'#ff8787'}}>GO</Text></View>
            </TouchableOpacity>          
          </View>
        </View>
      </Modal>
      <View style = {{padding: 10}}>
        <TouchableOpacity
          style={{position:'absolute', top: -25, right: 9, width: 28}}
          onPress = {() => setShowModal(true)}
        >
          <Feather name="plus" size={24} color="#ff8787" />
        </TouchableOpacity>
        <View 
          showsVerticalScrollIndicator={false}>
          <AlphabetList
            data={exerciseList}
            indexLetterStyle={{ 
              color: '#ff8787', 
              fontSize: 15,
            }}
            renderCustomItem={(item) => (
              <TouchableOpacity
              
              >
                <View style={styles.listItemContainer}>
                  <Text style={styles.listItemLabel}>{item.value}</Text>
                </View>
              </TouchableOpacity>
            )}
            renderCustomSectionHeader={(section) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 60,
    bottom: '50%'
  },
  backgroundBlur: {
    width: '100%',
    height: '100%',
  },
  newExerciseModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '75%',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    elevation: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: 'absolute',
    top: '10%',
    height: 100,
  },
  sameLine: {
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  listItemLabel: {
    fontSize: 20, 
    fontWeight: 'bold'    
  },
});

export default Exercises;