import RoutineInfo from '@/components/Home/RoutineInfo';
import SplitComponent from '@/components/Home/SplitComponent';
import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
import ProfileModal from '@/components/modals/ProfileModal';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import RoutineOptions from '@/components/modals/RoutineOptions';
import RoutinesModal from '@/components/modals/RoutinesModal';
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
        routinesModal,
        openRoutinesModal,
        closeRoutinesModal,
        routine,
        curDay,
        setDay,
    } = useHookHome();

    const { routines, deleteRoutineFromDB } = useContext(DBContext) 

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
                onEditProfile={closeSettingsModal}
                onEditGoals={closeSettingsModal}
                onNotificationSettings={closeSettingsModal}
                onAppearanceSettings={closeSettingsModal}
                onPrivacySettings={closeSettingsModal}
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
            />
            <RoutinesModal
                visible={routinesModal}
                onClose={closeRoutinesModal}
                onStart={onStart}
                favoriteRoutineIds={[1, 3]} // Example IDs
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
            <ScrollView style={{ paddingTop: 10, marginBottom: 83 }}>
                <SplitComponent
                    curDay={curDay} 
                    setDay={setDay} 
                    close={closeRoutineModal}
                />
                <RoutineInfo 
                    close={closeRoutineModal} 
                    open={openRoutineModal} 
                    openAddRoutine={openAddRoutineModal} 
                    routines={routines} 
                    openRoutineOptions={openRoutineOptionsModal}
                    openRoutinesModal={openRoutinesModal}
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
