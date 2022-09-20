import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
//@ts-ignore
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph} from 'expo-chart-kit';
import { Text, View } from './Themed';

export default function GraphInfo({ path }: { path: string }) {
  return (
    <View>
      <View>
        <Text>DATA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});
