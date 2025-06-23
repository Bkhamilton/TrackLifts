import { Text, TextInput, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
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

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <View style={[styles.statCard, { backgroundColor, borderColor: cardBorder }]}>
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
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    editableStatValue: {
        fontSize: 18,
        fontWeight: '700',
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
