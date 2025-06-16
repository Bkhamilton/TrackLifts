import { ClearView, ScrollView, Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import { addFavoriteRoutine, getFavoriteRoutineIds, removeFavoriteRoutine } from '@/db/user/RoutineFavorites';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseHeader from './ExerciseHeader';

interface RoutineModalProps {
    visible: boolean;
    close: () => void;
    start: (routine: ActiveRoutine) => void;
    routine: ActiveRoutine;
    onFavoriteChange?: () => void;
}

export default function RoutineModal({ visible, close, start, routine, onFavoriteChange }: RoutineModalProps) {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (db && routine?.id) {
            getFavoriteRoutineIds(db, user.id).then(ids => {
                setIsFavorite(ids.includes(routine.id));
            });
        }
    }, [db, routine, user.id]);

    const toggleFavorite = async () => {
        if (!db) return;
        if (isFavorite) {
            await removeFavoriteRoutine(db, user.id, routine.id);
            setIsFavorite(false);
        } else {
            await addFavoriteRoutine(db, user.id, routine.id);
            setIsFavorite(true);
        }
        if (onFavoriteChange) onFavoriteChange(); // Notify parent
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{routine.title}</Text>
                        <ClearView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 8 }}>
                                <MaterialCommunityIcons
                                    name={isFavorite ? "star" : "star-outline"}
                                    size={24}
                                    color="#ff8787"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={close} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                            </TouchableOpacity>
                        </ClearView>
                    </View>

                    {/* Exercises List */}
                    <ScrollView 
                        style={styles.exercisesContainer}
                        contentContainerStyle={styles.exercisesContent}
                    >
                        {routine.exercises.map((exercise) => (
                            <ExerciseHeader 
                                key={exercise.id}
                                exercise={exercise}
                            />
                        ))}
                    </ScrollView>

                    {/* Start Button */}
                    <TouchableOpacity 
                        onPress={() => start(routine)} 
                        style={styles.startButton}
                    >
                        <Text style={styles.startButtonText}>Start Workout</Text>
                        <MaterialCommunityIcons 
                            name="arrow-right" 
                            size={20} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
        backgroundColor: 'transparent',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    exercisesContainer: {
        marginBottom: 16,
        paddingTop: 16,
        backgroundColor: 'transparent',
    },
    exercisesContent: {
        paddingBottom: 8,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#ff8787',
    },
    startButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 8,
    },
});