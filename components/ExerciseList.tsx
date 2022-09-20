import * as React from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { Text, View } from './Themed';
import { Exercise } from '../types';
import Colors from '../constants/Colors';

export default function ExerciseList( { open, close, exercises, sortList, clearSort } : { open?: Function, close?: Function, exercises: Exercise[], sortList?: Function, clearSort? : Function }) {

  const [typeBold, setTypeBold] = React.useState( false );
  const [muscleGroupBold, setMuscleGroupBold] = React.useState( false );

  function toggleTypeBold() {
    setTypeBold(!typeBold);
    if (!typeBold) {
      sortList({type: "Type"})
    } else {
      clearSort();
    }
  }

  function toggleMGBold() {
    setMuscleGroupBold(!muscleGroupBold);
    if (!muscleGroupBold) {
      sortList({ type: "Muscle Group" })
    } else {
      clearSort();
    }
  }



  return (
    <View style={styles.container}>
      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          onPress={toggleTypeBold}
        >
          <View style={[styles.sortButtons, {borderWidth: (typeBold) ? 0 : 1}]}>
            <Text style={{fontWeight: (typeBold) ? "500" : "400"}}>Type</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleMGBold}
        >
          <View style={[styles.sortButtons, {borderWidth: (muscleGroupBold) ? 0 : 1}]}>
            <Text style={{fontWeight: (muscleGroupBold) ? "500" : "400"}}>Muscle Group</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 4, }}>
            <TouchableOpacity
              key={item.id}
              onPress={() => open(item)}
            >
              <View style={{ flexDirection: 'row', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 6, justifyContent: 'space-between'}}>
                <Text style={{ fontSize: 16 }}>{item.title} ({item.type})</Text>
                <View>
                  <Text style={{ fontWeight: '500', fontSize: 15}}>{item.muscleGroup}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    width: 350,
    height: '85%',
  },
  sortButtons: {
    width: 120,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 8,
  },
  sortButtonsContainer: {
    flexDirection: "row" , 
    marginLeft: 20, 
    justifyContent: 'space-evenly', 
    paddingBottom: 9, 
    paddingTop: 3,
    height: 40
  }
});
