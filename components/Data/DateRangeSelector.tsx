import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  dateRange: { start: Date; end: Date };
}

const DateRangeSelector: React.FC<Props> = ({ dateRange }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.dateButton}>
      <Text style={styles.dateText}>
        {dateRange.start.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
    
    <MaterialCommunityIcons 
      name="arrow-right" 
      size={20} 
      color="#666" 
      style={styles.arrow}
    />
    
    <TouchableOpacity style={styles.dateButton}>
      <Text style={styles.dateText}>
        {dateRange.end.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.goButton}>
      <Text style={styles.goButtonText}>Go</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    textAlign: 'center',
    color: '#495057',
  },
  arrow: {
    marginHorizontal: 8,
  },
  goButton: {
    backgroundColor: '#ff8787',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  goButtonText: {
    color: 'white',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
});

export default DateRangeSelector;