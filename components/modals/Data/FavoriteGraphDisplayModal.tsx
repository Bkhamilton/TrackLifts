import FavoriteExerciseAnalysisGraph from '@/components/Data/Graphs/FavoriteExerciseAnalysisGraph';
import { Text, View } from '@/components/Themed';
import { FavoriteGraph } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    graph: FavoriteGraph;
    onRequestRemoveFavorite?: (graph: FavoriteGraph) => void;
}

const FavoriteGraphDisplayModal: React.FC<Props> = ({ visible, onClose, graph, onRequestRemoveFavorite }) => {
    
    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    const handleRemoveFavorite = () => {
        onRequestRemoveFavorite!(graph);
        onClose();
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Dropdown menu button */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.graphTitle}>{graph.exercise} ({graph.equipment})</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                                onRequestRemoveFavorite &&
                                <TouchableOpacity onPress={() => handleRemoveFavorite()} style={styles.dropdownButton}>
                                    <MaterialCommunityIcons name='star' size={24} color="#ff8787" />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View key={graph.id} style={styles.graphCard}>
                        <View style={styles.graphHeader}>
                            <Text style={[styles.graphType, { backgroundColor: cardBorder }]}>{graph.graphType}</Text>
                        </View>
                        {graph.stats && graph.stats.length > 0 ? (
                            <View style={[styles.graphContainer, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
                                <FavoriteExerciseAnalysisGraph data={graph.stats} />
                            </View>
                        ) : (
                            <View style={[styles.graphPlaceholder, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
                                <Text style={styles.placeholderText}>
                                    {graph.graphType} Graph
                                </Text>
                                <MaterialCommunityIcons 
                                    name="chart-line" 
                                    size={40} 
                                    color="#adb5bd" 
                                />
                            </View>
                        )}
                        <View style={styles.graphStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{graph.currentMax} lbs</Text>
                                <Text style={styles.statLabel}>Current Max</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{graph.progress}{graph.progress > 0 ? ' %' : ''}</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{graph.lastUpdated} days ago</Text>
                                <Text style={styles.statLabel}>Last Updated</Text>
                            </View>
                        </View>
                        {graph.stats && graph.stats.length > 0 && (
                            <View style={{ marginTop: 12 }}>
                                <Text style={{ fontWeight: '600', marginBottom: 4 }}>Workout Results:</Text>
                                {graph.stats
                                    .filter(stat => stat.weight != null && stat.reps != null)
                                    .map((stat, idx) => (
                                        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                            <Text style={{ fontSize: 13 }}>
                                                {stat.workout_date ? new Date(stat.workout_date).toLocaleDateString() : 'Unknown date'}
                                            </Text>
                                            <Text style={{ fontSize: 13 }}>
                                                {stat.weight} lbs × {stat.reps} reps
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        )}                        
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 18,
        width: '92%',
        maxHeight: '90%',
        paddingVertical: 16,
        paddingHorizontal: 0,
        alignItems: 'stretch',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    dropdownButton: {
        padding: 8,
    },
    closeButton: {
        padding: 8,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    graphCard: {
        paddingHorizontal: 16,
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
        backgroundColor: '#e9ecef',
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
});

export default FavoriteGraphDisplayModal;