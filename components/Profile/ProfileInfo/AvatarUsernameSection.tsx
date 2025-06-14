import { Text, TextInput, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function AvatarUsernameSection({
    avatar,
    username,
    isEditing,
    onChange,
}: {
    avatar: string;
    username: string;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
}) {
    return (
        <View style={styles.section}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{avatar}</Text>
            </View>
            {isEditing ? (
                <TextInput
                    style={styles.editableUsername}
                    value={username}
                    onChangeText={value => onChange('username', value)}
                />
            ) : (
                <Text style={styles.username}>{username}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 12,
    },
    avatar: {
        fontSize: 48,
    },
    username: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 24,
    },
    editableUsername: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        alignSelf: 'center',
    },
});
