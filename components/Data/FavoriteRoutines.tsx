import { Text, View } from '@/components/Themed';
import { DataContext } from '@/contexts/DataContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

interface Props {}

const FavoriteRoutines: React.FC<Props> = () => {
    const backgroundColor = useThemeColor({}, 'grayBackground');
    const borderColor = useThemeColor({}, 'grayBorder');

    const { favoriteRoutines } = useContext(DataContext);

    // Helper to format last used date
    function formatLastUsed(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorite Routines</Text>
            <View style={styles.routinesContainer}>
                {favoriteRoutines && favoriteRoutines.length > 0 ? (
                    favoriteRoutines.map((routine: any) => (
                        <View
                            key={routine.routine_id}
                            style={[
                                styles.routineCard,
                                { backgroundColor, borderColor, borderWidth: 1 },
                            ]}
                        >
                            <Text style={styles.routineName}>{routine.routine_title}</Text>
                            <Text style={styles.routineFrequency}>
                                Used {routine.usage_count} time{routine.usage_count !== 1 ? 's' : ''}
                            </Text>
                            <Text style={styles.routineLastUsed}>
                                Last used: {formatLastUsed(routine.last_used)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No favorite routines yet</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    routinesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    routineCard: {
        width: '47%',
        borderRadius: 12,
        padding: 16,
        margin: 8,
    },
    routineName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    routineFrequency: {
        fontSize: 14,
        color: '#868e96',
    },
    routineLastUsed: {
        fontSize: 12,
        color: '#adb5bd',
        marginTop: 2,
    },
    emptyText: {
        color: '#868e96',
        fontStyle: 'italic',
        padding: 16,
        textAlign: 'center',
    },
});

export default FavoriteRoutines;