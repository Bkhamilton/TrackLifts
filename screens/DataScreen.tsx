import GraphInfo from '@/components/Data/GraphInfo';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import { StyleSheet } from 'react-native';

export default function DataScreen() {
    return (
        <View style={styles.container}>
            <View style={{top:60}}>
                <Title title="Data"></Title>
            </View>
            <View style={styles.scrollContainer}>
                <GraphInfo/>
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