import { Text, TextInput, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';

export default function AvatarUsernameSection({
    avatar,
    username,
    createdAt,
    isEditing,
    onChange,
}: {
    avatar: string;
    username: string;
    createdAt: string;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
}) {

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    const formatMemberSince = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };    

    return (
        <View style={styles.section}>
            <View style={[styles.avatarContainer, { backgroundColor }]}>
                <Text style={styles.avatar}>{avatar}</Text>
            </View>
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.editableUsername}
                        value={username}
                        onChangeText={value => onChange('username', value)}
                    />
                    <Text style={styles.memberSince}>Member since {formatMemberSince(createdAt)}</Text>                
                </>
            ) : (
                <>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.memberSince}>Member since {formatMemberSince(createdAt)}</Text>                
                </>
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
    },
    editableUsername: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ff8787',
        padding: 4,
        alignSelf: 'center',
    },
    memberSince: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
});
