import { ClearView, Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const MuscleGroupStats: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'grayBackground');
  const borderColor = useThemeColor({}, 'grayBorder');
  const { muscleGroupFocusBySet } = useContext(DataContext);

  // Build a map for quick lookup
  const statsMap = Object.fromEntries(
    muscleGroupFocusBySet.map(stat => [stat.muscle_group, stat.total_intensity])
  );
  const total = MUSCLE_GROUPS.reduce(
    (sum, group) => sum + (statsMap[group] || 0),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscle Group Focus</Text>
      <View style={[styles.statsContainer, { backgroundColor, borderColor }]}>
        <ClearView style={styles.statRow}>
          <ClearView style={styles.labelColumn}>
            {MUSCLE_GROUPS.map(group => (
              <Text key={group} style={styles.muscleLabel}>{group}</Text>
            ))}
          </ClearView>
          <ClearView style={styles.barColumn}>
            {MUSCLE_GROUPS.map(group => {
              const value = statsMap[group] || 0;
              const percent = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <View
                  key={group}
                  style={[
                    styles.bar,
                    { width: `${percent}%`, backgroundColor: percent > 0 ? '#ff8787' : '#e9ecef' }
                  ]}
                />
              );
            })}
          </ClearView>
          <ClearView style={styles.valueColumn}>
            {MUSCLE_GROUPS.map(group => {
              const value = statsMap[group] || 0;
              const percent = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <Text key={group} style={styles.valueText}>
                  {percent}%
                </Text>
              );
            })}
          </ClearView>
        </ClearView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    marginVertical: 4,
  },
  bar: {
    height: 16,
    backgroundColor: '#ff8787',
    borderRadius: 4,
    marginVertical: 4,
  },
  valueText: {
    height: 24,
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