import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { Exercise, RoutineList, workoutSet, Set } from '../types';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function Workout({ open, routine }: { open?: Function, routine: RoutineList }) {

    function WorkoutInfo( props: workoutSet ) {

      function SetHeader( props: {
        set: Set;
      } ) {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>#{props.set.number}</Text>
          </View>
        );
      }

      const sets = props.sets
      const setInfo = sets.map(type => <View key={type.number}><SetHeader set={type}/></View>)

      function addSet() {
        sets.push({
          number: sets.length + 1,
          weight: 100,
          reps: 10
        })
        console.log(sets.length);
      }

      return (
        <View style={{ borderWidth: 1 }}>
          <View>
            <Text style={{ fontSize: 17 }}>{props.exercise.title}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 14 }}>Sets</Text>
          </View>
          {setInfo}
          <TouchableOpacity
            onPress={addSet}
          >
            <View style={styles.addSetButton}>
              <Text>Add Set</Text>
            </View>
          </TouchableOpacity>
        </View>
        );
    }
    const exerciseComponents = routine.exercises.map(type => <View style={{paddingVertical: 4}} key={type.id}><WorkoutInfo exercise={type} sets={[{
      number: 1,
      weight: 100,
      reps: 10
    }]}/></View>)

  return (
    <View style={{width:350}}>
        {exerciseComponents}
        <TouchableOpacity
            style = {{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={open}
        >
            <View style = {styles.workoutButton}>
              <Text style={styles.workoutButtonText}>Add Exercise</Text>
            </View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutButton: {
    width:'100%',
    top: 8,
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
  addSetButton: {
    borderWidth: 1, 
    width: '100%', 
    alignItems: 'center', 
    borderRadius: 5, 
    backgroundColor: '#ff8787',
  },
});
