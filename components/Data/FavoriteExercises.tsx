import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  favorites: string[];
  onAddFavorite: () => void;
}

const FavoriteExercises: React.FC<Props> = ({ favorites, onAddFavorite }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Favorite Exercises</Text>
      <TouchableOpacity onPress={onAddFavorite}>
        <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
      </TouchableOpacity>
    </View>
    
    <View style={styles.exerciseContainer}>
      {favorites.map((exercise, index) => (
        <View key={index} style={styles.exercisePill}>
          <Text style={styles.exerciseText}>{exercise}</Text>
        </View>
      ))}
      
      {favorites.length === 0 && (
        <Text style={styles.emptyText}>No favorites yet. Add some!</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  exerciseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  exercisePill: {
    backgroundColor: '#e7f5ff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  exerciseText: {
    color: '#228be6',
    fontWeight: '500',
  },
  emptyText: {
    color: '#868e96',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default FavoriteExercises;