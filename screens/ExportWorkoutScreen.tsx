import { ScrollView, Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface ExportOptions {
    userProfile: boolean;
    routines: boolean;
    workoutHistory: boolean;
    exerciseData: boolean;
    splits: boolean;
    progressMetrics: boolean;
}

export default function ExportWorkoutScreen() {
    const router = useRouter();
    
    // State for export options
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        userProfile: true,
        routines: true,
        workoutHistory: true,
        exerciseData: true,
        splits: true,
        progressMetrics: true,
    });

    const toggleExportOption = (option: keyof ExportOptions) => {
        setExportOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const handleExport = () => {
        // This will be implemented later
        console.log('Exporting with options:', exportOptions);
        router.navigate('/(tabs)/(index)');
    };

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

interface ExportOptionProps {
    label: string;
    icon: IconName;
    value: boolean;
    onToggle: () => void;
    description: string;
}

const ExportOption = ({ label, icon, value, onToggle, description } : ExportOptionProps) => (
    <View style={styles.optionContainer}>
        <View style={styles.optionLeft}>
            <MaterialCommunityIcons name={icon} size={20} color="#666" />
            <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{label}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
        </View>
        <Switch 
            value={value}
            onValueChange={onToggle}
            thumbColor="#fff"
            trackColor={{ false: '#ddd', true: '#ff8787' }}
        />
    </View>
);

interface FormatOptionProps {
    label: string;
    icon: IconName;
    active: boolean;
}

const FormatOption = ({ label, icon, active } : FormatOptionProps) => (
    <View style={[styles.formatOption, active && styles.activeFormat]}>
        <MaterialCommunityIcons name={icon} size={20} color={active ? '#ff8787' : '#666'} />
        <Text style={[styles.formatLabel, active && styles.activeFormatLabel]}>{label}</Text>
    </View>
);

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
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    optionText: {
        marginLeft: 12,
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        color: '#666',
    },
    formatSection: {
        marginBottom: 32,
    },
    formatOptions: {
        flexDirection: 'row',
    },
    formatOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    activeFormat: {
        borderColor: '#ff8787',
        backgroundColor: 'rgba(255, 135, 135, 0.1)',
    },
    formatLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    activeFormatLabel: {
        color: '#ff8787',
        fontWeight: '500',
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