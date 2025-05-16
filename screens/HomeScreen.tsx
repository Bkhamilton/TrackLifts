import RoutineInfo from '@/components/Home/RoutineInfo';
import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
import ProfileModal from '@/components/modals/ProfileModal';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import SettingsModal from '@/components/modals/SettingsModal';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { DBContext } from '@/contexts/DBContext';
import useHookHome from '@/hooks/useHookHome';
import { ActiveRoutine, Exercise } from '@/utils/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {

    const { addRoutineToDB } = useContext(DBContext);

    const { 
        addRoutineModal,
        openAddRoutineModal,
        closeAddRoutineModal,
        profileModal,
        openProfileModal,
        closeProfileModal,
        settingsModal,
        openSettingsModal,
        closeSettingsModal,
        routineModal,
        openRoutineModal,
        closeRoutineModal,
        routineOptionsModal,
        openRoutineOptionsModal,
        closeRoutineOptionsModal,
        routine,
    } = useHookHome();

    const { routines } = useContext(DBContext) 

    const { isActiveWorkout, setRoutine } = useContext(ActiveWorkoutContext);

    const router = useRouter();

    const onAdd = (routine: { title: string; exercises: Exercise[] }) => {
        const newRoutine = {
            ...routine,
            id: 0, // ID will be auto-incremented by the database
        };
        addRoutineToDB(newRoutine)
            .then((id) => {
                if (id) {
                    console.log('Routine added with ID:', id);
                } else {
                    console.log('Failed to add routine');
                }
            })
            .catch((error) => {
                console.error('Error adding routine:', error);
            });
        closeAddRoutineModal();
    }

    const onStart = (routine: ActiveRoutine) => {
        setRoutine(routine);
        closeRoutineModal();
        if (isActiveWorkout) {
            alert('You already have an active workout. Please finish it before starting a new one.');
            setTimeout(() => {
                router.replace('/(tabs)/workout/activeWorkout');
            }, 500);
        } else {
            router.replace('/(tabs)/workout/newWorkout');
        }
        
    }

    return (
        <View style={styles.container}>
            <ProfileModal
                visible={profileModal}
                close={closeProfileModal}
            />
            <SettingsModal
                visible={settingsModal}
                close={closeSettingsModal}
            />
            <RoutineModal
                visible={routineModal}
                close={closeRoutineModal}
                start={onStart}
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
            <Title 
                title="TrackLifts"
                rightContent={
                    <View style={styles.rightContent}>
                        <TouchableOpacity onPress={openProfileModal}>
                            <Ionicons name="person" size={20} color="#ff8787" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openSettingsModal}>
                            <Ionicons name="settings" size={20} color="#ff8787" />
                        </TouchableOpacity>
                    </View>                        
                }
            /> 
            <ScrollView style={{ paddingTop: 10 }}>
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
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // Add spacing between the icons
    },  
});
