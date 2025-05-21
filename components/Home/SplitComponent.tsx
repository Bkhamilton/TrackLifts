import { Text, View } from '@/components/Themed';
import split from '@/data/Split.json';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface SplitComponentProps {
    curDay: string;
    setDay: React.Dispatch<React.SetStateAction<string>>;
    close: () => void;
}

export default function SplitComponent({ curDay, setDay, close }: SplitComponentProps) {
    const splitList = split.Split;

    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>SPLIT</Text>
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
                {splitList.map((day) => (
                    <TouchableOpacity
                        key={day.key}
                        style={[
                            styles.dayPill,
                            day.title === curDay && styles.activeDayPill
                        ]}
                        onPress={() => setDay(day.title)}
                    >
                        <Text 
                            style={[
                                styles.dayText,
                                day.title === curDay && styles.activeDayText
                            ]}
                        >
                            {day.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Start Workout Button */}
            <TouchableOpacity
                style={styles.startButton}
                onPress={close}
            >
                <Text style={styles.startButtonText}>Start {curDay} Workout</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
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
        marginRight: 4,
    },
    activeDayPill: {
        backgroundColor: '#ff8787',
    },
    dayText: {
        fontSize: 14,
        color: '#555',
    },
    activeDayText: {
        color: 'white',
        fontWeight: '600',
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