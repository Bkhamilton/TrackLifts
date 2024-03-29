import * as React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Database from '../database/Database';
import RoutineInfo from '../components/RoutineInfo';
import RoutineModal from '../components/modals/RoutineModal';
import ProfileModal from '../components/modals/ProfileModal';
import SettingsModal from '../components/modals/SettingsModal';
import RoutineOptions from '../components/modals/RoutineOptions';
import Title from '../components/Title';

import { View, ScrollView } from '../components/Themed';
import { RootTabScreenProps, Exercise, RoutineList, Routine } from '../types';
import AddRoutineModal from '../components/modals/AddRoutineModal';
import { TLRoutine } from '../database/types/types';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [showSettings, setShowSettings] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showRoutine, setShowRoutine] = React.useState(false);
  const [showAddRoutine, setAddRoutine] = React.useState(false);
  const [showRoutineOptions, setRoutineOptions] = React.useState(false);
  const [routineTitle, setRoutineTitle] = React.useState("");

  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [temp, setTemp] = React.useState({
    id: '0001',
    title: "Temp",
    exercises: ["Temp Workout"]
  })
  const [tempRoutine, setTempRoutine] = React.useState<Routine>({
    id: 1,
    title: "Temp"
  })
  const [routine, setRoutine] = React.useState({
    id: tempRoutine.id,
    title: tempRoutine.title,
    exercises: exercises
  })
  const [routineList, setRoutineList] = React.useState<Routine[]>([]);
  const [TLRoutine, setTLRoutine] = React.useState<TLRoutine[]>([]);

  const [routineID, setRoutineID] = React.useState(1);

  const db = Database.getInstance();

  React.useEffect(() => {
    // Load routine data
    loadData();
  });

  function createTables() {
    db.initializeRoutine(() => console.log("Routine Table Created"));
    db.initializeTLRoutine(() => console.log("TLRoutine Tabel Created"));
  }

  function loadData() {
    db.loadRoutineData((data: React.SetStateAction<Routine[]>) => setRoutineList(data));
  }
  
  function clearData() {
    db.clearTLRoutine(() => console.log("TLRoutine Cleared"));
  }

  function deleteRoutine(id: number) {
    db.deleteRoutine(id, () => console.log("Deleted Routine"));
    db.deleteTLRoutine(id, () => console.log("Deleted TLRoutine"))
  }

  function printTLRoutineData() {
    db.loadTLRoutineData((data) => console.log(data));
  }

  function printRoutineData() {
    db.loadRoutineData((data) => console.log(data));
  }

  function startWorkout(props: RoutineList) {
    setShowRoutine(false);
    navigation.jumpTo('NewWorkout', { routine: props });
  }

  function openRoutineOptions(props: Routine) {
    setRoutineOptions(true);
    setTempRoutine(props);
  }

  function closeRoutineOptions() {
    setRoutineOptions(false);
  }

  function openProfile() {
    setShowProfile(true)
  }

  function openSettings() {
    setShowSettings(true)
  }

  function closeProfile() {
    setShowProfile(false);
  }

  function closeSettings() {
    setShowSettings(false);
  }
  
  function closeRoutine() {
    setShowRoutine(false);
  }

  function openRoutineModal(props: Routine) {
    db.loadRoutineInfoData(props.id, (data: Exercise[]) => openRoutineHelper(props, data));
    setShowRoutine(true);
  }

  function openRoutineHelper(props: Routine, exercises: Exercise[]) {
    setRoutine({
      id: props.id,
      title: props.title,
      exercises: exercises
    })
  }

  function onDeleteRoutine(id: number) {
    deleteRoutine(id);
    setRoutineOptions(false);
  }

  function openAddRoutine() {
    setAddRoutine(true);
  }

  function addRoutine(props: {
    title: string,
    exercises: Exercise[];
  }) {
    var toAdd = {
      title: props.title
    }

    db.insertRoutine(toAdd, (data: number) => addRoutineHelper(data, props.exercises));
    setAddRoutine(false);
  }

  function addRoutineHelper(id: number, exercises: Exercise[]) {
    exercises.forEach( function (element) {
      db.insertTLRoutine({rid: id, exid: element.id}, (data: number) => console.log(data + " added: " + element.title));
    });
    setRoutineID(id);
  }

  function closeAddRoutine() {
    setAddRoutine(false);
  }

  return (
    <View style={styles.container}>
      <View style={{top:60}}>
        <Title title="TrackLifts"></Title>
        <TouchableOpacity
          style = {styles.profileButton}
          onPress = {openProfile}
        >
          <View>
            <Ionicons name="person" size={20} color="#ff8787" />
          </View>  
        </TouchableOpacity>
        <TouchableOpacity
          style = {styles.settingsButton}
          onPress = {openSettings}
        >
          <View>
            <Ionicons name="settings" size={20} color="#ff8787" />
          </View>  
        </TouchableOpacity>  
      </View>
      <AddRoutineModal visible={showAddRoutine} close={closeAddRoutine} add={addRoutine}></AddRoutineModal>
      <ProfileModal visible={showProfile} onPress={closeProfile}></ProfileModal>
      <SettingsModal visible={showSettings} onPress={closeSettings}></SettingsModal>
      <RoutineModal visible={showRoutine} close={closeRoutine} start={startWorkout} routine={routine}></RoutineModal>
      <RoutineOptions visible={showRoutineOptions} close={closeRoutineOptions} routine={tempRoutine} onDelete={onDeleteRoutine}></RoutineOptions>
      <ScrollView style={{top:60, paddingTop: 10}}>
        <RoutineInfo close={startWorkout} open={openRoutineModal} openAddRoutine={openAddRoutine} routines={routineList} openRoutineOptions={openRoutineOptions}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  profileButton: {
    position: 'absolute',
    right: 18,
  },
  settingsButton: {
    position: 'absolute',
    right: 45,
  },  
});
