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
            workoutsCompleted: 128,
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