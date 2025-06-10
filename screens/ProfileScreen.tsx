import MuscleIntensity from '@/components/Profile/MuscleIntensity/MuscleIntensity';
import ProfileMainInfo from '@/components/Profile/ProfileMainInfo';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {

    const profileData = {
        username: 'benkhamilton',
        avatar: '👤',
        stats: {
            height: '6\'0"',
            weight: '200 lbs',
            bodyFat: '15%',
            workoutsCompleted: 128,
            weeklyWorkouts: 5,
            weeklySets: 45,
            favoriteExercise: 'Bench Press',
            memberSince: 'Jan 2023',
            goals: 'Build muscle & endurance'
        },
    };

    return (
        <View style={styles.container}>
            <Title 
                title="TrackLifts"
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileMainInfo 
                    username={profileData.username}
                    avatar={profileData.avatar}
                    stats={profileData.stats}
                />
                <MuscleIntensity/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollContainer: {
        paddingTop: 4, 
        marginBottom: 83
    }
});