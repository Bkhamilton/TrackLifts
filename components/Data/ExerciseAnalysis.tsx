import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DateRangeSelector from './DateRangeSelector';

interface Props {
  exercise: string;
  onSelectExercise: () => void;
}

const ExerciseAnalysis: React.FC<Props> = ({ exercise, onSelectExercise }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    // Here you would typically fetch data for the new date range
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Analysis</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.exerciseSelector}
        onPress={onSelectExercise}
      >
        <Text style={styles.exerciseText}>{exercise}</Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
      
      <DateRangeSelector 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange}  
      />
      
      <View style={styles.graphPlaceholder}>
        <Text style={styles.placeholderText}>Exercise Progress Graph</Text>
        <Text style={styles.graphHint}>
          {exercise !== "Select an Exercise" 
            ? `Weight progression for ${exercise} will appear here`
            : 'Select an exercise to view progress'}
        </Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>125 lbs</Text>
          <Text style={styles.statLabel}>Current Max</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>+15 lbs</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>8 times</Text>
          <Text style={styles.statLabel}>Times Performed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  exerciseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  graphPlaceholder: {
    height: 200,
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#868e96',
    marginBottom: 8,
  },
  graphHint: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#868e96',
  },
});

export default ExerciseAnalysis;