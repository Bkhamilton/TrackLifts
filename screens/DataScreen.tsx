import { StyleSheet } from 'react-native';

import Title from '../components/Title';
import GraphInfo from '../components/GraphInfo';

import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function DataScreen({ navigation }: RootTabScreenProps<'Data'>) {
  return (
    <View style={styles.container}>
      <View style={{top:60}}>
        <Title title="Data"></Title>
      </View>
      <View style={styles.scrollContainer}>
        <GraphInfo path="/screens/DataScreen.tsx" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    top: 60,
    paddingTop: 10,
  }
});