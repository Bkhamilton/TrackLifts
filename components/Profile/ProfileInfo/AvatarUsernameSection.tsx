import { Text, TextInput, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
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

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <View style={styles.section}>
            <View style={[styles.avatarContainer, { backgroundColor }]}>
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
        marginBottom: 24,
    },
    editableUsername: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        alignSelf: 'center',
    },
});
