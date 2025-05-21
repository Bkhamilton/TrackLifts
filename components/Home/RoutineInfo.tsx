import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import RoutineCard from './RoutineCard';

interface RoutineInfoProps {
    close: () => void;
    open: (routine: ActiveRoutine) => void;
    openAddRoutine: () => void;
    routines: ActiveRoutine[];
    openRoutineOptions: (routine: ActiveRoutine) => void;
}

export default function RoutineInfo({ close, open, openAddRoutine, routines, openRoutineOptions }: RoutineInfoProps) {
    return (
        <View style={styles.container}>
            {/* SPLIT */}

            {/* ROUTINES */}
            <View style={{ marginTop: 5 }}>
                <Text
                    style={styles.getStartedText}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)"
                >
                    Routines
                </Text>
                <TouchableOpacity 
                    onPress={openAddRoutine}
                >
                    <View style={{ alignItems: 'center', position: 'absolute', right: 0, bottom: 2, borderWidth: 1, width: 60, borderRadius: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>ADD</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
                {
                    routines.map(item => (
                        <View style={{ paddingVertical: 2 }} key={item.id}>
                            <RoutineCard 
                                routine={item}
                                open={open} 
                                openRoutineOptions={openRoutineOptions} 
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
    },
    getStartedText: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    separator: {
        marginVertical: 15,
        height: 1,
        width: 350,
        alignItems: 'center',
    },
    workoutButton: {
        width: '100%',
        top: 15,
        height: 28,
        borderRadius: 5,
        backgroundColor: '#ff8787',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workoutButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
