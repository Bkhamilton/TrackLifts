import RoutineInfo from '@/components/Home/RoutineInfo';
import SplitComponent from '@/components/Home/SplitComponent';
import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
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
import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    const { 
        addRoutineModal,
        openAddRoutineModal,
        closeAddRoutineModal,
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
        curDay,
        setDay,
    } = useHookHome();

    const { addRoutineToDB, deleteRoutineFromDB } = useContext(DBContext) 

    const { isActiveWorkout, setRoutine } = useContext(ActiveWorkoutContext);

    const [favoritesRefreshKey, setFavoritesRefreshKey] = useState(0);

    const refreshFavorites = () => setFavoritesRefreshKey(k => k + 1);

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

    const onSelectOption = (option: string) => {
        switch (option) {
            case 'edit':
                router.push('/(tabs)/(index)/editRoutine')
                break;
            case 'delete':
                // Handle delete routine logic here
                deleteRoutineFromDB(routine.id)
                    .then(() => {
                        console.log('Routine deleted successfully');
                    })
                    .catch((error) => {
                        console.error('Error deleting routine:', error);
                    });
                break;
            case 'start':
                onStart(routine);
                break;
            default:
                console.warn('Unknown option selected:', option);
        }
        closeRoutineOptionsModal();
    }

    return (
        <View style={styles.container}>
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
                onFavoriteChange={refreshFavorites}
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
                onSelect={onSelectOption}
            />
            <Title 
                title="Home"
                rightContent={
                    <View style={styles.rightContent}>
                        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile/main')}>
                            <Ionicons name="person" size={20} color="#ff8787" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openSettingsModal}>
                            <Ionicons name="settings" size={20} color="#ff8787" />
                        </TouchableOpacity>
                    </View>                        
                }
            /> 
            <ScrollView style={styles.scrollView}>
                <SplitComponent
                    curDay={curDay} 
                    setDay={setDay} 
                    close={closeRoutineModal}
                    onStart={onStart}
                />
                <RoutineInfo 
                    open={openRoutineModal} 
                    openAddRoutine={openAddRoutineModal} 
                    openRoutineOptions={openRoutineOptionsModal}
                    favoritesRefreshKey={favoritesRefreshKey}
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
    scrollView: {
        paddingTop: 10, 
        marginBottom: 83
    } 
});
