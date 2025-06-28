import ExportOption from '@/components/ExportWorkout/ExportOption';
import FormatOption from '@/components/ExportWorkout/FormatOption';
import { ScrollView, Text, View } from '@/components/Themed';
import useHookExportWorkout from '@/hooks/useHookExportWorkout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ExportWorkoutScreen() {

    const router = useRouter();
    const {
        exportOptions,
        toggleExportOption,
        handleExport,
    } = useHookExportWorkout();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.navigate('/(tabs)/(index)')}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#ff8787" />
                </TouchableOpacity>
                <Text style={styles.title}>Export Workout Data</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.description}>
                    Select the data you want to export. The exported file will contain all 
                    your selected information in a structured JSON format.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Types</Text>
                    
                    <ExportOption 
                        label="User Profile"
                        icon="account"
                        value={exportOptions.userProfile}
                        onToggle={() => toggleExportOption('userProfile')}
                        description="Your personal information and profile stats"
                    />
                    
                    <ExportOption 
                        label="Routines"
                        icon="clipboard-list"
                        value={exportOptions.routines}
                        onToggle={() => toggleExportOption('routines')}
                        description="All your saved workout routines"
                    />
                    
                    <ExportOption 
                        label="Workout History"
                        icon="history"
                        value={exportOptions.workoutHistory}
                        onToggle={() => toggleExportOption('workoutHistory')}
                        description="Complete record of past workout sessions"
                    />
                    
                    <ExportOption 
                        label="Exercise Data"
                        icon="dumbbell"
                        value={exportOptions.exerciseData}
                        onToggle={() => toggleExportOption('exerciseData')}
                        description="Your exercise library and personal records"
                    />
                    
                    <ExportOption 
                        label="Splits"
                        icon="calendar"
                        value={exportOptions.splits}
                        onToggle={() => toggleExportOption('splits')}
                        description="Your workout splits and schedules"
                    />
                    
                    <ExportOption 
                        label="Progress Metrics"
                        icon="chart-line"
                        value={exportOptions.progressMetrics}
                        onToggle={() => toggleExportOption('progressMetrics')}
                        description="Strength progress and performance metrics"
                    />
                </View>

                <View style={styles.formatSection}>
                    <Text style={styles.sectionTitle}>Export Format</Text>
                    <View style={styles.formatOptions}>
                        <FormatOption 
                            label="JSON"
                            icon="code-json"
                            active={true}
                        />
                        {/* Future format options could be added here */}
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity 
                style={styles.exportButton}
                onPress={handleExport}
            >
                <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    formatSection: {
        marginBottom: 32,
    },
    formatOptions: {
        flexDirection: 'row',
    },
    exportButton: {
        backgroundColor: '#ff8787',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    exportButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});