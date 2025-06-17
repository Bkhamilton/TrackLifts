import { Text, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { RoutineContext } from '@/contexts/RoutineContext';
import { UserContext } from '@/contexts/UserContext';
import { getFavoriteRoutineIds } from '@/db/user/RoutineFavorites';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import RoutineCard from './RoutineCard';

interface RoutineInfoProps {
    open: (routine: ActiveRoutine) => void;
    openAddRoutine: () => void;
    openRoutineOptions: (routine: ActiveRoutine) => void;
    favoritesRefreshKey?: number; 
}

export default function RoutineInfo({ 
    open, 
    openAddRoutine, 
    openRoutineOptions,
    favoritesRefreshKey = 0,
}: RoutineInfoProps) {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);
    const { routines } = useContext(RoutineContext);
    const [favoriteRoutineIds, setFavoriteRoutineIds] = useState<number[]>([]);

    useEffect(() => {
        if (db && user?.id) {
            getFavoriteRoutineIds(db, user.id).then(setFavoriteRoutineIds);
        }
    }, [db, user, routines, favoritesRefreshKey]); // re-fetch if routines/user/db changes
    
    // Separate routines into favorites and others
    const favoriteRoutines = routines.filter(routine => 
        favoriteRoutineIds.includes(routine.id));
    const otherRoutines = routines.filter(routine => 
        !favoriteRoutineIds.includes(routine.id));
    
    // Display only first 3 of other routines (adjust as needed)
    const displayedOtherRoutines = otherRoutines.slice(0, 4);
    const hasMoreRoutines = otherRoutines.length > 4;

    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 5 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
                        Routines
                    </Text>
                    <TouchableOpacity 
                        onPress={openAddRoutine}
                        style={styles.addButton}
                    >
                        <View>
                            <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                        </View>  
                    </TouchableOpacity>
                </View>
                
                <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
                
                {/* Favorites Section */}
                {favoriteRoutines.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="star" size={18} color="#ff8787" />
                            <Text style={styles.sectionHeaderText}>Favorites</Text>
                        </View>
                        {favoriteRoutines.map(item => (
                            <View style={{ paddingVertical: 2 }} key={item.id}>
                                <RoutineCard 
                                    routine={item}
                                    open={open} 
                                    openRoutineOptions={openRoutineOptions} 
                                />
                            </View>
                        ))}
                    </>
                )}
                
                {/* Other Routines Section */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="dumbbell" size={18} color="#666" />
                    <Text style={styles.sectionHeaderText}>My Routines</Text>
                </View>
                {displayedOtherRoutines.map(item => (
                    <View style={{ paddingVertical: 2 }} key={item.id}>
                        <RoutineCard 
                            routine={item}
                            open={open} 
                            openRoutineOptions={openRoutineOptions} 
                        />
                    </View>
                ))}
                
                {/* Show All Button if there are more routines */}
                <TouchableOpacity onPress={() => router.replace('/(tabs)/(index)/routines')} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>Show All Routines ({otherRoutines.length})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    getStartedText: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    separator: {
        marginVertical: 15,
        height: 1,
        width: '100%',
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 8,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#333',
    },
    showAllButton: {
        marginTop: 12,
        paddingVertical: 8,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    showAllButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ff8787',
    },
});