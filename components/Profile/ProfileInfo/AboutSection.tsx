import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, TouchableOpacity } from 'react-native';
import EditableInfoRow from './EditableInfoRow';

export default function AboutSection({
    stats,
    onPress,
}: {
    stats: any;
    onPress?: () => void;
}) {

    const backgroundColor = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={[styles.infoCard, { backgroundColor, borderColor: cardBorder }]}>
                    <EditableInfoRow 
                        label="Member Since" 
                        value={stats.memberSince} 
                        isEditing={false}
                        onChange={() => {}}
                    />
                    <EditableInfoRow 
                        label="Goals" 
                        value={stats.goals} 
                        isEditing={false}
                        onChange={() => {}}
                    />
                </View>
            </View>
        </TouchableOpacity>
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
    infoCard: {
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
    },
});
