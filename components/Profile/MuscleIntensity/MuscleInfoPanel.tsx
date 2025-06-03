import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MuscleGroup = {
  id: string;
  name: string;
  value: number;
  description: string;
  exercises: string[];
};

const MuscleInfoPanel = ({
  selectedMuscleData,
}: {
  selectedMuscleData: MuscleGroup | null;
}) => {
  if (!selectedMuscleData) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Select a muscle group to see detailed information
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{selectedMuscleData.name}</Text>
      <Text style={styles.infoValue}>
        Intensity: <Text style={styles.highlightValue}>{Math.round(selectedMuscleData.value * 100)}%</Text>
      </Text>
      <Text style={styles.infoDescription}>
        {selectedMuscleData.description}
      </Text>
      <Text style={styles.sectionTitle}>Targeted Exercises:</Text>
      <View style={styles.exercisesContainer}>
        {selectedMuscleData.exercises.map((exercise, index) => (
          <View key={index} style={styles.exercisePill}>
            <Text style={styles.exerciseText}>{exercise}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a86e8',
  },
  infoValue: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  highlightValue: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  infoDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  exercisesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exercisePill: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  exerciseText: {
    fontSize: 14,
    color: '#1976d2',
  },
});

export default MuscleInfoPanel;
