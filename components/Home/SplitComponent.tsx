import { Text, View } from '@/components/Themed';
import { RoutineContext } from '@/contexts/RoutineContext';
import { SplitContext } from '@/contexts/SplitContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ConfirmationModal from '../modals/ConfirmationModal';
import OptionsModal from '../modals/OptionsModal';

interface SplitComponentProps {
    curDay: { day: number; routine: string };
    setDay: (dayObj: { day: number; routine: string }) => void;
    onStart: (routine: ActiveRoutine) => void;
}

export default function SplitComponent({ curDay, setDay, onStart }: SplitComponentProps) {
    const { routines } = useContext(RoutineContext);
    const { activeSplit, splits, completeCurrentSplitDay, refreshSplits, getCurrentSplitDay } = useContext(SplitContext);

    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

    const [showSkipModal, setShowSkipModal] = useState<boolean>(false);
    const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchCurrentDay = async () => {
            if (activeSplit) {
                const idx = await getCurrentSplitDay();
                setCurrentDayIndex(idx);
            }
        };
        fetchCurrentDay();
    }, [activeSplit, getCurrentSplitDay]);

    const cardBackground = useThemeColor({}, 'grayBackground'); // Use theme color for card background
    const cardBorder = useThemeColor({}, 'grayBorder'); // Use theme color for card border

    const router = useRouter();

    const handleStartWorkout = async (title: string) => {
        if (title === "Rest") {
            // If it's a rest day, increment the cycle for the Split
            await completeCurrentSplitDay();
            await refreshSplits();
            return;
        }
        const routine = routines?.find(r => r.title === title);
        if (routine) {
            onStart(routine);
        } else {
            console.error("Routine not found:", title);
        }
    };

    if (!activeSplit || splits.length === 0) {
        return (
            <View style={styles.container}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Create a Split</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push('/(tabs)/(index)/splits')}
                    >
                        <MaterialCommunityIcons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Single Untitled Pill */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysScrollContainer}
                >
                    <TouchableOpacity
                        style={[styles.dayPill, styles.activeDayPill]}
                        // Set as active by default
                        onPress={() => setDay({ day: 1, routine: "Untitled" })}
                    >
                        <Text style={[styles.dayText, styles.activeDayText]}>
                            Untitled
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Start Button */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => handleStartWorkout("Untitled")}
                >
                    <Text style={styles.startButtonText}>Start Untitled Workout</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    const onEditSplit = () => {
        router.push('/(tabs)/(index)/splits');
    }  

    return (
        <View style={styles.container}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>SPLIT: {activeSplit.name}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={onEditSplit}
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
                {activeSplit.routines.map((routine) => {
                    const isActive = routine.day === curDay.day && routine.routine === curDay.routine;
                    return (
                        <TouchableOpacity
                            key={`${routine.routine}-${routine.day}`}
                            style={[
                                styles.dayPill,
                                { backgroundColor: cardBackground },
                                isActive && styles.activeDayPill,
                                routine.routine === "Rest" && styles.restDayPill,
                                isActive && routine.routine === "Rest" && styles.activeRestDayPill,
                                currentDayIndex >= routine.day && { opacity: 0.5, borderWidth: 1, borderColor: cardBorder }
                            ]}
                            onPress={() => setDay({ day: routine.day, routine: routine.routine })}
                            onLongPress={isActive ? () => setShowOptionsModal(true) : undefined}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    isActive && styles.activeDayText,
                                    routine.routine === "Rest" && styles.restDayText
                                ]}
                            >
                                {routine.routine === "Rest" ? "Rest" : `${routine.routine}`}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Only show start button for workout days */}
            <TouchableOpacity
                style={[styles.startButton, { backgroundColor: curDay.routine === "Rest" ? 'rgba(255, 135, 135, 0.6)' : '#ff8787' }]}
                onPress={() => handleStartWorkout(curDay.routine)}
                onLongPress={() => setShowOptionsModal(true)}
            >
                <Text style={styles.startButtonText}>{curDay.routine === "Rest" ? "Skip Rest Day" : `Start ${curDay.routine} Workout`}</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
            <ConfirmationModal
                visible={showSkipModal}
                message="Are you sure you want to skip this day in the cycle?"
                onClose={() => setShowSkipModal(false)}
                onSelect={async (choice) => {
                    if (choice === 'yes') {
                        // If user confirms, complete the current split day
                        await completeCurrentSplitDay();
                        await refreshSplits();
                    }
                    setShowSkipModal(false);
                }}
            />
            <OptionsModal
                visible={showOptionsModal}
                title={curDay.routine}
                options={[
                    { label: 'Start Workout', value: 'start' },
                    { label: 'Skip Workout', value: 'skip' }
                ]}
                close={() => setShowOptionsModal(false)}
                onSelect={async (value) => {
                    if (value === 'start') {
                        handleStartWorkout(curDay.routine);
                    } else if (value === 'skip') {
                        // Handle split deletion logic here
                        // For now, just close the modal
                        setShowOptionsModal(false);
                        setShowSkipModal(true);
                    }
                }}
            />
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