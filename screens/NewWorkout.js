import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';



function NewWorkout({route}) {
  const [text, setText] = React.useState('')
  const onPress = () => setText("Pressed")

  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>New Workout</Text>
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          onPress = {onPress}
        >
          <Feather name="plus" size={24} color="#ff8787" />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <Text style={{fontWeight:'800', fontSize: 16}}> {route.params.routine} </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    top: 60
  },
  titleContainer: {
    alignItems: 'center'
  },
  addButton: {
    top: -25,
    right: 13,
    alignItems: 'flex-end'
  },
  listContainer: {
    flex: 1, 
    alignItems: 'flex-start', 
    top: 25,
    left: 5,
  },  
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold'    
  },
  listTitleText: {
    fontSize: 14,
  }
});

export default NewWorkout;