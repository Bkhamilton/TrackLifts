import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

const tempData= [{
  date: "3/10/2022",
  routine: "Shoulders",
  lengthMin: '80',
  totalWeight: '16608'
},{
  date: '3/9/2022',
  routine: 'Legs',
  lengthMin: '54',
  totalWeight: '28380'
},{
  date: '3/8/2022',
  routine: 'Pull',
  lengthMin: '93',
  totalWeight: '24765'
}]

function History() {
  const [showModal, setShowModal] = React.useState(false)
  const [data, setData] = React.useState(tempData[0])

  function HistoryHeader(props) {
    function convertTime(timeMin) {
      let newTime;
      if (parseInt(timeMin, 10) > 60) {
        newTime = "" + (Math.floor(parseInt(timeMin, 10) / 60)) + "hr" + (parseInt(timeMin,10) % 60) + "min";
      } else {
        newTime = "" + timeMin + "min";
      }
      return newTime;
    }

    return (
      <View style={{height:40}}>
        <TouchableOpacity style={{top: 10}}

        >
          <View style={{width:'100%', height: 36, borderWidth:1, flexDirection: 'row', alignItems: 'center',}}>
            <Text>{props.name.date}</Text>
            <Text style={{fontWeight:'500'}}> {props.name.routine}</Text>
            <Text> {convertTime(props.name.lengthMin)}</Text>
            <Text> {props.name.totalWeight}lbs</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  const historyList = tempData.map(type => <View style={{width:300}}><HistoryHeader name={type} /></View>)

  function HistoryModal(props) {
    return (
      <View>
        
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.titleText}>History</Text>
      </View>
      <View style={{padding:5, left:5, top:40}}>
        <Text style={{fontSize:14, fontWeight: '800'}}>March 2022</Text>
        <Text>{historyList}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    top: 60
  },
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold'    
  }
});

export default History;