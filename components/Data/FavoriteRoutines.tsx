import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Routine {
  name: string;
  frequency: string;
}

interface Props {
  routines: Routine[];
}

const FavoriteRoutines: React.FC<Props> = ({ routines }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Favorite Routines</Text>
    
    <View style={styles.routinesContainer}>
      {routines.map((routine, index) => (
        <View key={index} style={styles.routineCard}>
          <Text style={styles.routineName}>{routine.name}</Text>
          <Text style={styles.routineFrequency}>{routine.frequency}</Text>
        </View>
      ))}
      
      {routines.length === 0 && (
        <Text style={styles.emptyText}>No favorite routines yet</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  routinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  routineCard: {
    width: '47%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    margin: 8,
  },
  routineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routineFrequency: {
    fontSize: 14,
    color: '#868e96',
  },
  emptyText: {
    color: '#868e96',
    fontStyle: 'italic',
    padding: 16,
    textAlign: 'center',
  },
});

export default FavoriteRoutines;