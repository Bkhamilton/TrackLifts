import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

import RoutineInfo from '@/components/Home/RoutineInfo';
import Title from '../components/Title';

import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import { ScrollView, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext';
import useHookHome from '@/hooks/useHookHome';
import { Exercise } from '@/utils/types';

export default function HomeScreen() {

    const { 
        addRoutineModal,
        closeAddRoutineModal,
        routineOptionsModal,
        closeRoutineOptionsModal,
        routineModal,
        closeRoutineModal, 
        openRoutineModal, 
        openAddRoutineModal, 
        openRoutineOptionsModal,
        routine,
    } = useHookHome();

    const { routines } = useContext(DBContext) 

    const onAdd = (routine: { title: string; exercises: Exercise[] }) => {
        console.log('Add Routine:', routine);
    }

    return (
        <View style={styles.container}>
            <RoutineModal
                visible={routineModal}
                close={closeRoutineModal}
                start={(routine) => {
                    console.log('Start Routine:', routine);
                }}
                routine={routine}
            />
            <AddRoutineModal
                visible={addRoutineModal}
                close={closeAddRoutineModal}
                add={onAdd}
            />
            <RoutineOptions
                visible={routineOptionsModal}
                close={closeRoutineOptionsModal}
                routine={routine} 
                onDelete={(id) => {
                    console.log('Delete Routine with ID:', id);
                }}
            />
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
                    close={closeRoutineModal} 
                    open={openRoutineModal} 
                    openAddRoutine={openAddRoutineModal} 
                    routines={routines} 
                    openRoutineOptions={openRoutineOptionsModal}
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
