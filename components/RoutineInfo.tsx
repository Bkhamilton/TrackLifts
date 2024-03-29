import * as React from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

import split from '../data/Split.json';

import { Text, View } from './Themed';
import { Routine } from '../types';

export default function RoutineInfo({ close, open, openAddRoutine, routines, openRoutineOptions }: { close?: Function, open?: Function, openAddRoutine?: Function, routines: Routine[], openRoutineOptions?: Function }) {
    const splitList = split.Split;
    const [curDay, setDay] = React.useState("Arms")

    function SplitList(props: {
        name: string;
        curDay: string;
      }) {
        return (
          <View style={{ top:3 }}>
            <Text style={{ fontWeight:(props.name == props.curDay) ? 'bold' : 'normal', fontSize:14 }}>{ props.name } </Text>
          </View>
        );
      }
      const textInputComponents = splitList.map(type => <View key={type.key}><SplitList name={type.title} curDay={curDay}/></View>)

    function RoutineHeader(props: Routine) {
      return (
        <View style={{ borderWidth: 1 }}>
          <TouchableOpacity 
            style={{ paddingVertical: 8, paddingHorizontal: 2 }}
            onPress = {() => open(props)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>{props.title}</Text>
              <TouchableOpacity
                onPress={() => openRoutineOptions(props)}
              >
                <View style={{ paddingVertical: 2, paddingHorizontal: 8 }}>
                  <SimpleLineIcons name="options" size={20} color="#ff8787" />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    const routineComponents = routines.map(type => <View style={{ paddingTop: 6 }} key={type.id}><RoutineHeader id={type.id} title={type.title}/></View>)

  return (
    <View style={styles.container}>
        <View style={styles.splitTitle}>
          <Text style={{fontSize:16, fontWeight: '500'}}>SPLIT: {textInputComponents}</Text>
          <TouchableOpacity
            style = {{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={close}
          >
            <View style = {styles.workoutButton}>
              <Text style={styles.workoutButtonText}>Start New Workout: {curDay} </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{marginTop:5,}}>
          <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Routines
          </Text>
          <TouchableOpacity
            onPress={openAddRoutine}
          >
            <View style={{alignItems: 'center', position: 'absolute', right: 0, bottom: 2, borderWidth: 1, width: 60, borderRadius: 4}}>
              <Text style={{fontSize: 16, fontWeight: '600'}}>ADD</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
          {routineComponents}
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  splitTitle: {
    width: '100%',
    height: 75,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: 350,
    alignItems: 'center',
  },
  routineTitle: {
    width: '100%',
    paddingHorizontal: 5,
    top: 30,
    left: "3%",
  },
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold'    
  },
  routineTitleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  workoutButton: {
    width:'100%',
    top: 15,
    height: 28,
    borderRadius: 5,
    backgroundColor: '#ff8787',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutButtonText: {
    fontSize: 12, 
    fontWeight: '600',
  },
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
