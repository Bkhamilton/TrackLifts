import { Text, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { getAllTimeExerciseSessionStatDetails } from '@/db/data/ExerciseSessionStatDetails';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function DataTab({ exercise }: { exercise: Exercise }) {

    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [statDetails, setStatDetails] = useState<any>(null);

    useEffect(() => {
        const fetchStatDetails = async () => {
            if (db && exercise) {
                const details = await getAllTimeExerciseSessionStatDetails(db, user.id, exercise.id);
                setStatDetails(details);
            }
        };

        fetchStatDetails();
    }, [db, exercise]);

        // Helper to format stat values or show placeholder
    const formatStat = (value: any, suffix = '') =>
        value === null || value === undefined
            ? '-'
            : `${Number.isFinite(value) ? Math.round(value * 100) / 100 : value}${suffix}`;

    return (
        <View style={styles.dataContainer}>
            <Text style={styles.header}>Exercise Data</Text>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Top Set</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.statValue}>
                        {statDetails && statDetails.top_set_weight !== null && statDetails.top_set_reps !== null
                            ? `${statDetails.top_set_weight} lbs x ${statDetails.top_set_reps} reps`
                            : '-'}
                    </Text>
                </View>
            </View>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Heaviest Set</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.statValue}>
                        {statDetails && statDetails.heaviest_set_weight !== null && statDetails.heaviest_set_reps !== null
                            ? `${statDetails.heaviest_set_weight} lbs x ${statDetails.heaviest_set_reps} reps`
                            : '-'}
                    </Text>
                </View>
            </View>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Most Weight Moved</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.statValue}>
                        {statDetails && statDetails.total_volume !== null
                            ? `${formatStat(statDetails.total_volume)} lbs`
                            : '-'}
                    </Text>
                </View>
            </View>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Weight</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.statValue}>
                        {statDetails && statDetails.avg_weight !== null
                            ? `${formatStat(statDetails.avg_weight)} lbs`
                            : '-'}
                    </Text>
                </View>
            </View>
            <View style={styles.statRow}>
                <Text style={styles.statLabel}>Repetitions</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.statValue}>
                        {statDetails && statDetails.most_reps_weight !== null && statDetails.most_reps_reps !== null
                            ? `${statDetails.most_reps_weight} lbs x ${statDetails.most_reps_reps} reps`
                            : '-'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dataContainer: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e3dada',
        borderRadius: 5,
    },
    header: {
        fontWeight: '500',
        marginBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    statLabel: {
        width: 140,
        fontSize: 14,
    },
    valueBox: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: '#f1f3f5',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    statValue: {
        fontWeight: '600',
        fontSize: 15,
        color: '#ff8787',
    },
});