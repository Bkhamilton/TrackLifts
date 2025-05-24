import { Text, View } from '@/components/Themed';
import sampleSplit from '@/data/SampleSplit.json';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface SplitComponentProps {
    curDay: { day: number; routine: string };
    setDay: (dayObj: { day: number; routine: string }) => void;
    close: () => void;
}

export default function SplitComponent({ curDay, setDay, close }: SplitComponentProps) {
    // Get the unique routine names (excluding Rest)
    const uniqueDays = [...new Set(sampleSplit.routines
        .filter(routine => routine.routine !== "Rest")
        .map(routine => routine.routine)
    )];

    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>SPLIT: {sampleSplit.name}</Text>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => console.log('Edit split')}
                >
                    <MaterialCommunityIcons name="pencil" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Horizontal Scrollable Days */}
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysScrollContainer}
            >
                {sampleSplit.routines.map((routine) => (
                    <TouchableOpacity
                        key={`${routine.routine}-${routine.day}`}
                        style={[
                            styles.dayPill,
                            routine.day === curDay.day && routine.routine === curDay.routine && styles.activeDayPill,
                            routine.routine === "Rest" && styles.restDayPill,
                            routine.day === curDay.day && routine.routine === curDay.routine && routine.routine === "Rest" && styles.activeRestDayPill
                        ]}
                        onPress={() => setDay({ day: routine.day, routine: routine.routine })}
                    >
                        <Text 
                            style={[
                                styles.dayText,
                                routine.day === curDay.day && routine.routine === curDay.routine && styles.activeDayText,
                                routine.routine === "Rest" && styles.restDayText
                            ]}
                        >
                            {routine.routine === "Rest" ? "Rest" : `${routine.routine}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Only show start button for workout days */}
            {curDay.routine !== "Rest" && (
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={close}
                >
                    <Text style={styles.startButtonText}>Start {curDay.routine} Workout</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginHorizontal: 16,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        padding: 4,
    },
    daysScrollContainer: {
        paddingBottom: 12,
        marginLeft: 8,
    },
    dayPill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    activeDayPill: {
        backgroundColor: '#ff8787',
    },
    restDayPill: {
        backgroundColor: 'rgba(240, 240, 240, 0.6)',
    },
    activeRestDayPill: {
        backgroundColor: 'rgba(255, 135, 135, 0.6)',
    },
    dayText: {
        fontSize: 14,
        color: '#555',
    },
    activeDayText: {
        color: 'white',
        fontWeight: '600',
    },
    restDayText: {
        color: 'rgba(85, 85, 85, 0.6)',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff8787',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 8,
        marginHorizontal: 16,
    },
    startButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 8,
    },
});