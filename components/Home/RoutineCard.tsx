import { Text } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface RoutineCardProps {
    routine: ActiveRoutine;
    open: (routine: ActiveRoutine) => void;
    openRoutineOptions: (routine: ActiveRoutine) => void;
}

export default function RoutineCard({ routine, open, openRoutineOptions }: RoutineCardProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.touchable}
                onPress={() => open(routine)}
            >
                <View style={styles.row}>
                    <Text style={styles.title}>{routine.title}</Text>
                    <TouchableOpacity onPress={() => openRoutineOptions(routine)}>
                        <View style={styles.options}>
                            <SimpleLineIcons name="options" size={20} color="#ff8787" />
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
    },
    touchable: {
        paddingVertical: 8,
        paddingHorizontal: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    options: {
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
});
