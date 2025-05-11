import { Text } from '@/components/Themed';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface RoutineCardProps {
    id: number;
    title: string;
    open: (item: { id: number; title: string }) => void;
    openRoutineOptions: (item: { id: number; title: string }) => void;
}

export default function RoutineCard({ id, title, open, openRoutineOptions }: RoutineCardProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.touchable}
                onPress={() => open({ id, title })}
            >
                <View style={styles.row}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={() => openRoutineOptions({ id, title })}>
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
