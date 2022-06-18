import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

function Home({navigation}) {
  const routineList = ["Push", "Pull", "Legs", "Shoulders", "Arms", "Legs"]
  const [routines, setRoutines] = React.useState(routineList)
  const [curDay, setDay] = React.useState("Shoulders")
  const [temp, setTemp] = React.useState('')

  const [showSettings, setShowSettings] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)
  const [showRoutine, setShowRoutine] = React.useState(false)

  function startWorkout(props) {
    setShowRoutine(false)
    navigation.jumpTo('Add', {routine: temp})
  }

  function openRoutineModal(props) {
    setShowRoutine(true)
    setTemp(props.name)
  }

  function SplitList(props) {
    let boldOrNot = (props.name == curDay) ? 'bold' : 'normal'
    return (
      <View>
        <Text style={{fontWeight:boldOrNot}}>{props.name} </Text>
      </View>
    );
  }
  const textInputComponents = routineList.map(type => <View><SplitList name={type}/></View>)

  function RoutineHeader(props) {
    return (
      <View style={{height: 45}}>
        <Modal
          visible = {showRoutine}
          transparent = {true}
          animationType = 'fade'
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalPopup,{width:'85%', top: '-5%',}]}>
              <TouchableOpacity
                onPress = {() => setShowRoutine(false)}
              >
                <View
                  style={{
                    position: 'abolute',
                    width:28,
                    bottom: 5,
                  }}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress = {() => startWorkout(props)}
              >
                <View
                  style={{
                    position: 'absolute',
                    width:28,
                    height: 20,
                    right: 10,
                    bottom: 5,
                  }}
                >
                  <Text style={{color:'#ff8787'}}>GO</Text>
                </View>
              </TouchableOpacity>
              <Text> {temp} </Text>
            </View>
          </View>
        </Modal>
        <TouchableOpacity 
          style={{borderWidth:1, height: 40, padding:5,}}
          onPress = {() => openRoutineModal(props)}
        >
          <Text>{props.name}</Text>
        </TouchableOpacity>
      </View>      
    );
  }
  const textRoutineList = routineList.map(type => <View style={{width: 350}}><RoutineHeader name={type} /></View>)

  return (
    <View style={styles.container}>
      <View style={{alignItems:'center'}}>
        <Text style = {styles.titleText}>TrackLifts</Text>
      </View>
      <TouchableOpacity
        style = {{
          position: 'absolute',
          top: 0,
          right: 18,
        }}
        onPress = {() => setShowProfile(true)}
      >
        <View>
          <Ionicons name="person" size={20} color="#ff8787" />
        </View>  
      </TouchableOpacity>
      <TouchableOpacity
        style = {{
          position: 'absolute',
          top: 0,
          right: 45,
        }}
        onPress = {() => setShowSettings(true)}
      >
        <View>
          <Feather name="settings" size={20} color="#ff8787" />
        </View>  
      </TouchableOpacity> 
      <Modal
        visible = {showProfile}
        transparent = {true}
        animationType = 'fade'
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalPopup,{width:'90%', top:'-5%', height: '80%',}]}>
            <TouchableOpacity
              onPress = {() => setShowProfile(false)}
            >
              <View>
                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible = {showSettings}
        transparent = {true}
        animationType = 'fade'
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalPopup,{width:'85%', top: '-5%',}]}>
            <TouchableOpacity
              onPress = {() => setShowSettings(false)}
            >
              <View>
                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>              
      <View style={styles.splitTitle}>
        <Text style={{fontSize:15,}}>SPLIT: {textInputComponents}</Text>
        <TouchableOpacity
          style = {{
            top: -10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress = {() => navigation.jumpTo('Add', {routine: curDay})}
        >
          <View style = {{
            width:'100%',
            top: 15,
            height: 28,
            borderRadius: 5,
            backgroundColor: '#ff8787',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{fontSize: 12, fontWeight: '600'}}>Start New Workout: {curDay} </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.routineTitle}>
        <Text style={styles.routineTitleText}>Routines</Text>
        <View style={{top: 10}}> 
          <Text>{textRoutineList}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    top: 60
  },
  modalPopup:{
    backgroundColor: '#ffffff',
    elevation: 20,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitTitle: {
    width: '90%',
    left: '5%',
    height: 80,
    top: 30,
  },
  routineTitle: {
    width: '90%',
    paddingHorizontal: 5,
    alignItems: 'flex-start',
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
  }
});

export default Home;