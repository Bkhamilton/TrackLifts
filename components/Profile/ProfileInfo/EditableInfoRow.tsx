import { Text, TextInput, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function EditableInfoRow({ 
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
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isEditing ? (
                <TextInput
                    style={styles.editableInfoValue}
                    value={value}
                    onChangeText={onChange}
                />
            ) : (
                <Text style={styles.infoValue}>{value}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    editableInfoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        minWidth: 150,
        textAlign: 'right',
    },
});
