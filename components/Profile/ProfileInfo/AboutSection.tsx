import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import EditableInfoRow from './EditableInfoRow';

export default function AboutSection({
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
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoCard}>
                <EditableInfoRow 
                    label="Member Since" 
                    value={stats.memberSince} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.memberSince', value)}
                />
                <EditableInfoRow 
                    label="Goals" 
                    value={stats.goals} 
                    isEditing={isEditing}
                    onChange={value => onChange('stats.goals', value)}
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
    infoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
});
