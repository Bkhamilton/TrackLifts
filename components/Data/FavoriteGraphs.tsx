import { ScrollView, Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

interface FavoriteGraph {
  id: string;
  exercise: string;
  graphType: string;
  currentMax: string;
  progress: string;
  lastUpdated: string;
}

interface Props {
  favorites: FavoriteGraph[];
  onAddFavorite: () => void;
  onSelectGraph: (graph: FavoriteGraph) => void;
}

const FavoriteGraphs: React.FC<Props> = ({ favorites, onAddFavorite, onSelectGraph }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.75;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Graphs</Text>
        <TouchableOpacity onPress={onAddFavorite}>
          <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
        </TouchableOpacity>
      </View>
      
      {favorites.length > 0 ? (
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {favorites.map((graph) => (
            <TouchableOpacity 
              key={graph.id}
              style={[styles.graphCard, { width: cardWidth }]}
              onPress={() => onSelectGraph(graph)}
            >
              <View style={styles.graphHeader}>
                <Text style={styles.graphTitle}>{graph.exercise}</Text>
                <Text style={styles.graphType}>{graph.graphType}</Text>
              </View>
              
              <View style={styles.graphPlaceholder}>
                <Text style={styles.placeholderText}>
                  {graph.graphType} Graph
                </Text>
                <MaterialCommunityIcons 
                  name="chart-line" 
                  size={40} 
                  color="#adb5bd" 
                />
              </View>
              
              <View style={styles.graphStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{graph.currentMax}</Text>
                  <Text style={styles.statLabel}>Current Max</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{graph.progress}</Text>
                  <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{graph.lastUpdated}</Text>
                  <Text style={styles.statLabel}>Last Updated</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity 
          style={styles.emptyContainer}
          onPress={onAddFavorite}
        >
          <MaterialCommunityIcons 
            name="chart-line" 
            size={40} 
            color="#adb5bd" 
          />
          <Text style={styles.emptyText}>No favorite graphs yet</Text>
          <Text style={styles.emptySubtext}>Tap to add your first one</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  graphCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  graphType: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  graphPlaceholder: {
    height: 120,
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#868e96',
    marginBottom: 8,
  },
  graphStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#868e96',
    marginTop: 4,
  },
  emptyContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 4,
  },
});

export default FavoriteGraphs;