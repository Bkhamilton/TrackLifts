import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

import RoutineInfo from '../components/RoutineInfo';
import Title from '../components/Title';

import { ScrollView, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import { RootTabScreenProps } from '../types';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {

    const { db, routines } = useContext(DBContext) 

    return (
        <View style={styles.container}>
            <View style={{top:60}}>
                <Title title="TrackLifts"></Title>
                <TouchableOpacity
                    style = {styles.profileButton}
                
                >
                <View>
                    <Ionicons name="person" size={20} color="#ff8787" />
                </View>  
                </TouchableOpacity>
                <TouchableOpacity
                    style = {styles.settingsButton}
                
                >
                <View>
                    <Ionicons name="settings" size={20} color="#ff8787" />
                </View>  
                </TouchableOpacity>  
            </View>
            <ScrollView style={{top:60, paddingTop: 10}}>
                <RoutineInfo 
                    close={startWorkout} 
                    open={openRoutineModal} 
                    openAddRoutine={openAddRoutine} 
                    routines={routines} 
                    openRoutineOptions={openRoutineOptions}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
    },
    profileButton: {
        position: 'absolute',
        right: 18,
    },
    settingsButton: {
        position: 'absolute',
        right: 45,
    },  
});
