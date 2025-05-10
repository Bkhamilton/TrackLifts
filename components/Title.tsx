import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function Title({ title }: { title: string }) {
  return (
    <View style={styles.container}>
        <Text style = {styles.title}>{title}</Text>
        <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    top: 10,
    height: 1,
    width: 350,
  },
});
