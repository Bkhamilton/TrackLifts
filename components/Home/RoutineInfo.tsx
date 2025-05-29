import { Text, View } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import RoutineCard from './RoutineCard';

interface RoutineInfoProps {
    close: () => void;
    open: (routine: ActiveRoutine) => void;
    openAddRoutine: () => void;
    routines: ActiveRoutine[];
    openRoutineOptions: (routine: ActiveRoutine) => void;
    openRoutinesModal: () => void; // Add this prop
}

export default function RoutineInfo({ 
    close, 
    open, 
    openAddRoutine, 
    routines, 
    openRoutineOptions,
    openRoutinesModal 
}: RoutineInfoProps) {
    // Hardcoded favorite routine IDs for now
    const favoriteRoutineIds = [2, 3]; // Replace with your actual favorite IDs
    
    // Separate routines into favorites and others
    const favoriteRoutines = routines.filter(routine => 
        favoriteRoutineIds.includes(routine.id));
    const otherRoutines = routines.filter(routine => 
        !favoriteRoutineIds.includes(routine.id));
    
    // Display only first 3 of other routines (adjust as needed)
    const displayedOtherRoutines = otherRoutines.slice(0, 3);
    const hasMoreRoutines = otherRoutines.length > 3;

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 5 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
                        Routines
                    </Text>
                    <TouchableOpacity onPress={openAddRoutine}>
                        <View style={styles.addButton}>
                            <Text style={styles.addButtonText}>ADD</Text>
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
                <TouchableOpacity onPress={openRoutinesModal} style={styles.showAllButton}>
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
        alignItems: 'center',
        borderWidth: 1,
        width: 60,
        borderRadius: 4,
        paddingVertical: 2,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 12,
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