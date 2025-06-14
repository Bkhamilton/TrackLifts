import { ClearView, Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function ProgressInsightsCard() {
    const router = useRouter();
    
    // Sample data - replace with your actual data
    const progressData = {
        workoutsThisWeek: 4,
        progressPercentage: 12, // % increase from last week
        streak: 8, // days
        caloriesBurned: 3420, // weekly total
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => router.replace('/(tabs)/profile/data')}
            >
                <ClearView style={styles.header}>
                    <Text style={styles.title}>Progress Insights</Text>
                    <MaterialCommunityIcons 
                        name="chart-line" 
                        size={24} 
                        color="#ff8787" 
                    />
                </ClearView>
                
                <ClearView style={styles.statsContainer}>
                    <StatPill 
                        icon="fire" 
                        value={`${progressData.workoutsThisWeek}`} 
                        label="Workouts" 
                        trend="up" 
                    />
                    <StatPill 
                        icon="trending-up" 
                        value={`+${progressData.progressPercentage}%`} 
                        label="Progress" 
                        trend="up" 
                    />
                    <StatPill 
                        icon="calendar-check" 
                        value={`${progressData.streak}d`} 
                        label="Streak" 
                        trend="neutral" 
                    />
                </ClearView>
                
                <ClearView style={styles.footer}>
                    <Text style={styles.linkText}>View detailed analytics →</Text>
                </ClearView>
            </TouchableOpacity>
        </View>
    );
}

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function StatPill({ icon, value, label, trend }: { 
    icon: MaterialCommunityIconName; 
    value: string; 
    label: string;
    trend: 'up' | 'down' | 'neutral';
}) {
    const trendColor = {
        up: '#4CAF50',
        down: '#F44336',
        neutral: '#FFC107'
    };
    
    return (
        <View style={styles.pill}>
            <MaterialCommunityIcons 
                name={icon} 
                size={16} 
                color={trendColor[trend]} 
                style={styles.pillIcon}
            />
            <Text style={styles.pillValue}>{value}</Text>
            <Text style={styles.pillLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginVertical: 8,
        paddingVertical: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    pill: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    pillIcon: {
        marginRight: 6,
    },
    pillValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
    },
    pillLabel: {
        fontSize: 12,
        color: '#666',
    },
    footer: {
        alignItems: 'flex-end',
    },
    linkText: {
        color: '#ff8787',
        fontWeight: '500',
    },
});