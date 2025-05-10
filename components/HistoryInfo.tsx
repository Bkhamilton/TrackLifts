import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { History } from '../types';
import { Text, View } from './Themed';

export default function HistoryInfo({ open, data }: { open: Function, data: History[] }) {

    function HistoryHeader(props: {
      history: History
    }) {

        function convertTime(timeMin: string) {
          let newTime;
          if (parseInt(timeMin, 10) > 60) {
            newTime = "" + (Math.floor(parseInt(timeMin, 10) / 60)) + "hr" + (parseInt(timeMin,10) % 60) + "min";
          } else {
            newTime = "" + timeMin + "min";
          }
          return newTime;
        }
    
        return (
          <View>
            <TouchableOpacity
              onPress={open(props.history.routine)}
            >
              <View style={styles.historyModal}>
                <Text>{props.history.date}</Text>
                <Text style={{fontWeight:'500'}}> {props.history.routine.title}</Text>
                <Text> {convertTime(props.history.lengthMin)}</Text>
                <Text> {props.history.totalWeight}lbs</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }

      const historyList = data.map(type => <View style={{ paddingVertical: 2}} key={type.id}><HistoryHeader history={type} /></View>)


    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize:14, fontWeight: '800' }}>March 2022</Text>
            </View>
            <View style={{ paddingTop: 10 }}>
              {historyList}
            </View>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
      width: 350,
    },
    titleText: {
      fontSize: 18, 
      fontWeight: 'bold'    
    },
    historyModal: {
      width:'100%', 
      borderWidth:1, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: 4,
      paddingVertical: 10
    }
});