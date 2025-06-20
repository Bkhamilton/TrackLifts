import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import EditableStatCard from './EditableStatCard';

export default function WorkoutStatsSection({
    stats,
    isEditing,
    onChange,
}: {
    stats: any;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Stats</Text>
            <View style={styles.statsGrid}>
                <EditableStatCard 
                    label="Workouts" 
                    value={stats.workoutsCompleted.toString()} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.workoutsCompleted', value)}
                />
                <EditableStatCard 
                    label="Weekly Workouts" 
                    value={stats.weeklyWorkouts.toString()} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.weeklyWorkouts', value)}
                />
                <EditableStatCard 
                    label="Weekly Sets" 
                    value={stats.weeklySets.toString()} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.weeklySets', value)}
                />
                <EditableStatCard 
                    label="Top Exercise" 
                    value={stats.topExercise} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.favoriteExercise', value)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
});
