import { ClearView, ScrollView, Text, View } from '@/components/Themed';
import { FavoriteGraph } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    favorites: FavoriteGraph[];
    onAddFavorite: () => void;
    onSelectGraph: (graph: FavoriteGraph) => void;
}

const FavoriteGraphs: React.FC<Props> = ({ favorites, onAddFavorite, onSelectGraph }) => {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth * 0.8;

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Favorite Graphs</Text>
                <TouchableOpacity onPress={onAddFavorite}>
                    <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                </TouchableOpacity>
            </View>
            
            {favorites && favorites.length > 0 ? (
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {favorites.map((graph) => (
                        <TouchableOpacity 
                            key={graph.id}
                            style={[styles.graphCard, { width: cardWidth, backgroundColor: cardBackground, borderColor: cardBorder }]}
                            onPress={() => onSelectGraph(graph)}
                        >
                            <ClearView style={styles.graphHeader}>
                                <Text style={styles.graphTitle}>{graph.exercise} ({graph.equipment})</Text>
                                <Text style={[styles.graphType, { backgroundColor: cardBorder }]}>{graph.graphType}</Text>
                            </ClearView>

                            {
                                graph.stats && graph.stats.length > 0 ? (
                                    <View style={[styles.graphContainer, { backgroundColor: cardBorder, borderColor: cardBorder }]}>
                                        {/* <FavoriteExerciseAnalysisGraph
                                            data={graph.stats}
                                        /> */}
                                    </View>
                                ) : (
                                    <View style={[styles.graphPlaceholder, { backgroundColor: cardBorder, borderColor: cardBorder }]}>
                                        <Text style={styles.placeholderText}>
                                            {graph.graphType} Graph
                                        </Text>
                                        <MaterialCommunityIcons 
                                            name="chart-line" 
                                            size={40} 
                                            color="#adb5bd" 
                                        />
                                    </View>
                                )
                            }
                            
                            <ClearView style={styles.graphStats}>
                                <ClearView style={styles.statItem}>
                                    <Text style={styles.statValue}>0 lbs</Text>
                                    <Text style={styles.statLabel}>Current Max</Text>
                                </ClearView>
                                <ClearView style={styles.statItem}>
                                    <Text style={styles.statValue}>+0 lbs</Text>
                                    <Text style={styles.statLabel}>Progress</Text>
                                </ClearView>
                                <ClearView style={styles.statItem}>
                                    <Text style={styles.statValue}>2 days ago</Text>
                                    <Text style={styles.statLabel}>Last Updated</Text>
                                </ClearView>
                            </ClearView>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <TouchableOpacity 
                    style={[styles.emptyContainer, { backgroundColor: cardBackground }]}
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
        marginBottom: 8,
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
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        fontSize: 15,
        fontWeight: '600',
    },
    graphType: {
        fontSize: 14,
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
    graphContainer: {
        height: 120,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
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
    },
    statLabel: {
        fontSize: 12,
        color: '#868e96',
        marginTop: 4,
    },
    emptyContainer: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#868e96',
        marginTop: 4,
    },
});

export default FavoriteGraphs;