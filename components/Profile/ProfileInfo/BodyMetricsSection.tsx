import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import EditableStatCard from './EditableStatCard';

export default function BodyMetricsSection({
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
            <Text style={styles.sectionTitle}>Body Metrics</Text>
            <View style={styles.statsGrid}>
                <EditableStatCard 
                    label="Height" 
                    value={stats.height} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.height', value)}
                />
                <EditableStatCard 
                    label="Weight" 
                    value={stats.weight} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.weight', value)}
                />
                <EditableStatCard 
                    label="Body Fat" 
                    value={stats.bodyFat} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.bodyFat', value)}
                />
                <EditableStatCard
                    label="Favorite Exercise"
                    value={stats.favoriteExercise}
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
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
});
