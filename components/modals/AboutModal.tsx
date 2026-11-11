import EditableInfoRow from '@/components/Profile/ProfileInfo/EditableInfoRow';
import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

export default function AboutModal({
    visible,
    onClose,
    stats,
    onChange,
    isEditing,
    isSaving,
    isReady,
    error,
    onEditToggle,
}: {
    visible: boolean;
    onClose: () => void;
    stats: any;
    onChange: (field: string, value: string) => void;
    isEditing: boolean;
    isSaving: boolean;
    isReady: boolean;
    error: string | null;
    onEditToggle: () => Promise<void>;
}) {
    const grayText = useThemeColor({}, 'grayText');

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>About</Text>
                        <TouchableOpacity onPress={onEditToggle} disabled={!isReady || isSaving}>
                            <Text>{isSaving ? 'Saving…' : isEditing ? 'Save' : 'Edit'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} disabled={isSaving} style={styles.closeButton} accessibilityLabel="Close About and discard only unsaved Goals changes">
                            {isEditing ? <Text>Cancel</Text> : <MaterialCommunityIcons name="close" size={22} color={grayText} />}
                        </TouchableOpacity>
                    </View>
                    {isEditing && <Text>Save updates Goals only. Other profile edits stay pending.</Text>}
                    {error && <Text accessibilityRole="alert">{error}</Text>}
                    <EditableInfoRow
                        label="Goals"
                        value={stats.goals}
                        isEditing={isEditing && !isSaving}
                        onChange={value => onChange('stats.goals', value)}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '90%',
        borderRadius: 12,
        padding: 24,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    closeButton: {
        marginLeft: 12,
    },
});