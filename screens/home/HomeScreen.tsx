import RoutineInfo from '@/components/Home/RoutineInfo';
import SplitComponent from '@/components/Home/SplitComponent';
import AddRoutineModal from '@/components/modals/AddRoutineModal/AddRoutineModal';
import HelpSupportModal from '@/components/modals/HelpSupportModal';
import NotificationSettingsModal from '@/components/modals/NotificationSettingsModal';
import OptionsModal from '@/components/modals/OptionsModal';
import PrivacySettingsModal from '@/components/modals/PrivacySettingsModal';
import RoutineModal from '@/components/modals/RoutineModal/RoutineModal';
import SettingsModal from '@/components/modals/SettingsModal';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { HomeContext } from '@/contexts/HomeContext';
import { RoutineContext } from '@/contexts/RoutineContext';
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
        helpSupportModal,
        openHelpSupportModal,
        closeHelpSupportModal,
        privacySettingsModal,
        openPrivacySettingsModal,
        closePrivacySettingsModal,
        notificationModal,
        openNotificationModal,
        closeNotificationModal,
        routine,
        curDay,
        setDay,
    } = useHookHome();

    const { setRoutineToEdit } = useContext(HomeContext);

    const { addRoutineToDB, deleteRoutineFromDB } = useContext(RoutineContext); 

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
                setRoutineToEdit(routine);
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

    const onSelectSetting = (option: string) => {
        switch (option) {
            case 'editProfile':
                router.push('/(tabs)/profile/profileInfo');
                break;
            case 'editGoals':
                router.push('/(tabs)/profile/profileInfo');
                break;
            case 'notificationSettings':
                openNotificationModal();
                break;
            case 'appearanceSettings':
                // router.push('/(tabs)/settings/appearance');
                break;
            case 'privacySettings':
                openPrivacySettingsModal();
                break;
            case 'exportData':
                // router.push('/(tabs)/settings/exportData');
                break;
            case 'helpSupport':
                openHelpSupportModal();
                break;
            default:
                console.warn('Unknown setting selected:', option);
        }
        closeSettingsModal();
    }

    return (
        <View style={styles.container}>
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
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}    
            >
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
            <NotificationSettingsModal
                visible={notificationModal}
                close={closeNotificationModal}
            />
            <HelpSupportModal
                visible={helpSupportModal}
                close={closeHelpSupportModal}
            />
            <PrivacySettingsModal
                visible={privacySettingsModal}
                close={closePrivacySettingsModal}
            />
            <SettingsModal
                visible={settingsModal}
                close={closeSettingsModal}
                onSelect={onSelectSetting}
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
            <OptionsModal
                visible={routineOptionsModal}
                close={closeRoutineOptionsModal}
                title={routine.title}
                options={[
                    { label: 'Start Workout', value: 'start' },
                    { label: 'Edit Routine', value: 'edit' },
                    { label: 'Delete Routine', value: 'delete', destructive: true }
                ]}
                onSelect={onSelectOption}
            />
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
