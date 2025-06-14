import { Text, TextInput, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function EditableStatCard({ 
    label, 
    value, 
    isEditing, 
    onChange 
}: { 
    label: string; 
    value: string; 
    isEditing: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <View style={styles.statCard}>
            {isEditing ? (
                <TextInput
                    style={styles.editableStatValue}
                    value={value}
                    onChangeText={onChange}
                />
            ) : (
                <Text style={styles.statValue}>{value}</Text>
            )}
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    editableStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        width: '100%',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
});
