import { ClearView, Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

const MuscleGroupStats: React.FC = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Muscle Group Focus</Text>
        
        <View style={styles.statsContainer}>
            <ClearView style={styles.statRow}>
                <ClearView style={styles.labelColumn}>
                    <Text style={styles.muscleLabel}>Chest</Text>
                    <Text style={styles.muscleLabel}>Back</Text>
                    <Text style={styles.muscleLabel}>Legs</Text>
                    <Text style={styles.muscleLabel}>Shoulders</Text>
                    <Text style={styles.muscleLabel}>Arms</Text>
                    <Text style={styles.muscleLabel}>Core</Text>
                </ClearView>
                
                <ClearView style={styles.barColumn}>
                    <View style={[styles.bar, { width: '85%' }]} />
                    <View style={[styles.bar, { width: '75%' }]} />
                    <View style={[styles.bar, { width: '65%' }]} />
                    <View style={[styles.bar, { width: '60%' }]} />
                    <View style={[styles.bar, { width: '55%' }]} />
                    <View style={[styles.bar, { width: '50%' }]} />
                </ClearView>
                
                <ClearView style={styles.valueColumn}>
                    <Text style={styles.valueText}>85%</Text>
                    <Text style={styles.valueText}>75%</Text>
                    <Text style={styles.valueText}>65%</Text>
                    <Text style={styles.valueText}>60%</Text>
                    <Text style={styles.valueText}>55%</Text>
                    <Text style={styles.valueText}>50%</Text>
                </ClearView>
            </ClearView>
        </View>
    </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
  },
  labelColumn: {
    width: 80,
  },
  barColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  valueColumn: {
    width: 50,
    alignItems: 'flex-end',
  },
  muscleLabel: {
    height: 24,
    color: '#495057',
    marginVertical: 4,
  },
  bar: {
    height: 16,
    backgroundColor: '#74c0fc',
    borderRadius: 4,
    marginVertical: 4,
  },
  valueText: {
    height: 24,
    color: '#495057',
    marginVertical: 4,
  },
  graphPlaceholder: {
    height: 150,
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#868e96',
  },
});

export default MuscleGroupStats;