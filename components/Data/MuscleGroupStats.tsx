import { ClearView, Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import MuscleGroupPieChart from './Graphs/MuscleGroupPieChart';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const COLOR_PALETTE = [
  "#ff8787", "#ffd43b", "#69db7c", "#4dabf7", "#b197fc", "#ffa94d"
];

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

  // Prepare data for the pie chart and legend
  const data = MUSCLE_GROUPS.map((group, idx) => ({
    label: group,
    value: statsMap[group] || 0,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    percent: total > 0 ? Math.round(((statsMap[group] || 0) / total) * 100) : 0,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscle Group Focus</Text>
      <View style={[styles.statsContainer, { backgroundColor, borderColor }]}>
        <MuscleGroupPieChart />
        <ClearView style={styles.legendContainer}>
          {data.map((item) => (
            <ClearView key={item.label} style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendPercent}>{item.percent}%</Text>
            </ClearView>
          ))}
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
    borderRadius: 12,
    paddingVertical: 16,
  },
  pieChartContainer: {
    height: 220,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    fontSize: 16,
  },
  legendPercent: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default MuscleGroupStats;