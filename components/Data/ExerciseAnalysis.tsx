import { Text, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { fillResultsWithDates } from '@/utils/workoutUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import DateRangeSelector from './DateRangeSelector';
import ExerciseAnalysisGraph from './Graphs/ExerciseAnalysisGraph';

interface Props {
    exercise: Exercise;
    onSelectExercise: () => void;
}

type GraphType = 
    | 'Top Set' 
    | 'Heaviest Set' 
    | 'Most Weight Moved' 
    | 'Average Weight' 
    | 'Most Repetitions';

const graphTypeToStatType = {
    'Top Set': 'top_set',
    'Heaviest Set': 'heaviest_set',
    'Most Weight Moved': 'total_volume',
    'Average Weight': 'avg_weight',
    'Most Repetitions': 'most_reps',
} as const;

const ExerciseAnalysis: React.FC<Props> = ({ exercise, onSelectExercise }) => {
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date(),
    });
    const [graphType, setGraphType] = useState<GraphType>('Top Set');
    const [showGraphTypeModal, setShowGraphTypeModal] = useState(false);
    const [graphData, setGraphData] = useState<any[]>([]);    
    const [exerciseStats, setExerciseStats] = useState<any>({
        currentMax: 0,
        progress: "+0",
        timesPerformed: 0,
    });

    const { fetchExerciseSessionStats, fetchExerciseStats } = useContext(DataContext);

    const handleDateRangeChange = (start: Date, end: Date) => {
        setDateRange({ start, end });
        // Here you would typically fetch data for the new date range
    };

    const handleGraphTypeSelect = (type: GraphType) => {
        setGraphType(type);
        setShowGraphTypeModal(false);
    };

    const handleGo = async () => {
        if (!exercise || exercise.title === "Select an Exercise") {
            alert('Please select an exercise first.');
            return;
        }
        // Map GraphType to statType
        const statType = graphTypeToStatType[graphType];
        const results = await fetchExerciseStats(
            exercise.id,
            dateRange.start.toISOString(),
            dateRange.end.toISOString(),
            statType
        );
        if (!results || results.length === 0) {
            alert('No data available for the selected exercise and date range.');
            return;
        }
        setExerciseStats({
            ...exerciseStats,
            timesPerformed: results.length,
        });
        const filledResults = fillResultsWithDates(results, dateRange.start, dateRange.end);
        setGraphData(filledResults);
    };

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const borderColor = useThemeColor({}, 'grayBorder');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Exercise Analysis</Text>
                
                <TouchableOpacity 
                    style={[styles.graphTypeSelector, { backgroundColor: backgroundColor, borderColor: borderColor }]}
                    onPress={() => setShowGraphTypeModal(true)}
                >
                    <Text style={styles.graphTypeText}>{graphType}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={[styles.exerciseSelector, { backgroundColor: backgroundColor, borderColor: borderColor }]}
                onPress={onSelectExercise}
            >
                <Text style={styles.exerciseText}>{exercise.title}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            <DateRangeSelector 
                dateRange={dateRange} 
                onDateRangeChange={handleDateRangeChange}  
                onGo={handleGo}
            />

            {
                graphData.length > 0 ? (
                    <View style={[styles.graphContainer, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
                        <ExerciseAnalysisGraph
                            data={graphData}
                        />
                    </View>
                ) : (
                    <View style={[styles.graphPlaceholder, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
                        <Text style={styles.placeholderText}>
                            {graphType} Graph for {exercise.title !== "Select an Exercise" ? exercise.title : 'Selected Exercise'}
                        </Text>
                        <Text style={styles.graphHint}>
                            {exercise.title !== "Select an Exercise" 
                                ? `${graphType} data for ${exercise.title} will appear here`
                                : 'Select an exercise to view progress'}
                        </Text>
                    </View>
                )
            }
            
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{exerciseStats.currentMax} lbs</Text>
                    <Text style={styles.statLabel}>Current Max</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{exerciseStats.progress} lbs</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: backgroundColor }]}>
                    <Text style={styles.statValue}>{exerciseStats.timesPerformed} times</Text>
                    <Text style={styles.statLabel}>Times Performed</Text>
                </View>
            </View>

            {/* Graph Type Selector Modal */}
            <Modal visible={showGraphTypeModal} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {(['Top Set', 'Heaviest Set', 'Most Weight Moved', 'Average Weight', 'Repetitions'] as GraphType[]).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={styles.modalOption}
                                onPress={() => handleGraphTypeSelect(type)}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    graphType === type && styles.selectedOptionText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    graphTypeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#f1f3f5',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    graphTypeText: {
        fontSize: 14,
        fontWeight: '500',
        marginRight: 4,
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
    graphContainer: {
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#868e96',
        marginBottom: 8,
        textAlign: 'center',
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
    },
    statLabel: {
        fontSize: 12,
        color: '#868e96',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '70%',
        borderRadius: 12,
        padding: 16,
    },
    modalOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        color: '#ff8787',
        fontWeight: '600',
    },
});

export default ExerciseAnalysis;