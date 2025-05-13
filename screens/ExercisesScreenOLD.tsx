import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExerciseList from '../components/ExerciseList';
import AddExerciseModal from '../components/modals/AddExerciseModal/AddExerciseModal';
import ExerciseModal from '../components/modals/ExerciseModal';
import { View } from '../components/Themed';
import Title from '../components/Title';
import { Exercise, RootTabScreenProps } from '../types';

import Database from '../database/Database';

export default function ExercisesScreen({ navigation }: RootTabScreenProps<'Exercises'>) {
  const [workoutModal, setWorkoutModal] = React.useState( false );
  const [exerciseModal, setExerciseModal] = React.useState( false );
  const [tempExercise, setTempExercise] = React.useState({
    id: 0,
    title: "",
    type: "",
    muscleGroup: ""
  });
  const [exerciseList, setExerciseList] = React.useState<Exercise[]>([]);
  const [sort, setSort] = React.useState("title");

  const db = Database.getInstance();

  React.useEffect(() => {
    // Load exercise data
    loadData();
  });

  function errorModal(exercise: Exercise) {
    console.log("Error!");
  }

  function createTable() {
    db.initializeExercise(() => console.log("Exercise Table Created"));
  }

  function addExerciseToDB(exercise: Exercise) {
    const isFound = exerciseList.some(element => {
      if (element.title == exercise.title && element.type == exercise.type && element.muscleGroup == exercise.muscleGroup) {
        return true;
      }
    
      return false;
    });

    if (!isFound) {
      db.insertExercise(exercise, (data: number) => console.log(data))
    } else {
      errorModal(exercise);
    }
  }

  function deleteExercise(id: number) {
    db.deleteExercise(id, () => console.log("Deleted " + id))
  }

  function onDelete(props: Exercise) {
    deleteExercise(props.id);
    closeExercise();
  }

  function loadData() {
    db.loadExerciseSortByData(sort, (dataArray: React.SetStateAction<Exercise[]>) => 
        setExerciseList(dataArray));
  }

  function openWorkout() {
    setWorkoutModal(true)
  }

  function closeWorkout() {
    setWorkoutModal(false)
  }

  function closeExercise() {
    setExerciseModal(false)
  }

  function openExercise(props: Exercise) {
    setTempExercise(props)
    setExerciseModal(true)
  }

  function addExercise(props) {
    var toAdd = {
      title: props.title,
      type: props.type,
      muscleGroup: props.muscleGroup
    }
    addExerciseToDB(toAdd);
    setWorkoutModal(false);
  }

  function sortList(props) {
    if (props.type == "Type") {
      setSort("type, title");
    }
    if (props.type == "Muscle Group") {
      setSort("muscleGroup, title");
    }
  }

  function clearSort() {
    setSort("title");
  }

  return (
    <View style={styles.container}>
      <View style={{ top:60 }}>
        <Title title="Exercises"></Title>
        <TouchableOpacity
          style = {styles.plusButton}
          onPress = {openWorkout}
        >
          <View>
            <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
          </View>  
        </TouchableOpacity>
      </View>
      <AddExerciseModal visible={workoutModal} close={closeWorkout} add={addExercise}></AddExerciseModal>
      <ExerciseModal visible={exerciseModal} close={closeExercise} exercise={tempExercise} onDelete={onDelete}></ExerciseModal>
      <View style={{ top: 60, paddingTop: 10 }}>
        <ExerciseList open={openExercise} close={closeExercise} exercises={exerciseList} sortList={sortList} clearSort={clearSort}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  plusButton: {
    position: 'absolute',
    right: 18,
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