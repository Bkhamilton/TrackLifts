import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

function Data() {

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', }}>
        <Text style={styles.titleText}>Data</Text>
      </View>
      <View style={{padding:5, left: 5, top: 40}}>
        <Text style={styles.favoritesHeaderText}>Favorites</Text>
        <Text style={{fontWeight:"bolder"}}>GRAPHS NOT SUPPORTED ON SNACK</Text>
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
  },
  favoritesHeaderText: {
    fontSize: 14,
    fontWeight: '800',
  }
});

export default Data;