import FavoriteExerciseAnalysisGraph from '@/components/Data/Graphs/FavoriteExerciseAnalysisGraph';
import { Text, View } from '@/components/Themed';
import { FavoriteGraph } from '@/constants/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import ConfirmationModal from './ConfirmationModal';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Props {
    visible: boolean;
    onClose: () => void;
    graph: FavoriteGraph;
    onRemoveFavorite: (exerciseId: number, graphType: string) => void;
}

const FavoriteGraphDisplayModal: React.FC<Props> = ({ visible, onClose, graph, onRemoveFavorite }) => {
    
    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    const [modalVisible, setModalVisible] = useState(false);
    const [iconName, setIconName] = useState<IconName>('star');

    const handleRemoveFavorite = () => {
        setModalVisible(true);
    };
    
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
                        <TouchableOpacity onPress={handleRemoveFavorite} style={styles.dropdownButton}>
                            <MaterialCommunityIcons name={iconName} size={24} color="#ff8787" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                        </TouchableOpacity>
                    </View>
                    <View key={graph.id} style={styles.graphCard}>
                        <View style={styles.graphHeader}>
                            <Text style={styles.graphTitle}>{graph.exercise} ({graph.equipment})</Text>
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
                                <Text style={styles.statValue}>0 lbs</Text>
                                <Text style={styles.statLabel}>Current Max</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>+0 lbs</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>2 days ago</Text>
                                <Text style={styles.statLabel}>Last Updated</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <ConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message={`Are you sure you want to remove ${graph.exercise} from your favorites?`}
                onSelect={(choice) => {
                    if (choice === 'yes') {
                        setIconName('star-outline'); // Change icon to outline
                        onRemoveFavorite(graph.exercise_id, graph.graphType);
                    }
                    setModalVisible(false);
                }}
            />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
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
        padding: 16,
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