import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import { StyleSheet } from 'react-native';

import Title from '../components/Title';
import Workout from '../components/Workout';
import AddToWorkoutModal from '../components/modals/AddToWorkoutModal';
import Database from '../database/Database';

import { Text, View, ScrollView } from '../components/Themed';
import { Exercise, RootTabScreenProps, RoutineList } from '../types';

export default function NewWorkoutScreen({ navigation, route }: { navigation: RootTabScreenProps<'Home'>, route: { params: { routine: RoutineList }} }) {
  const [modal, setModal] = React.useState(false);
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const db = Database.getInstance();

  React.useEffect(() => {
    // Load routine data
    loadData();
  });

  function loadData() {
    db.loadExerciseData((dataArray: React.SetStateAction<Exercise[]>) => setExercises(dataArray));
  }

  const Routine = route.params.routine;

  function openModal(){
    setModal(true)
  }

  function closeModal(){
    setModal(false)
  }

  function addToWorkout(props: Exercise) {
    Routine.exercises.push(props)
    setModal(false)
  }

  return (
    <View style={styles.container}>
      <View style={{top:60}}>
        <Title title={Routine.title}></Title>
      </View>
      <AddToWorkoutModal visible={modal} close={closeModal} add={addToWorkout} exercises={exercises}></AddToWorkoutModal>
      <ScrollView style={{ top:60, paddingTop: 10 }}>
        <Workout routine={Routine} open={openModal}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '90%',
  },
});
