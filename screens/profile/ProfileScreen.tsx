import MuscleIntensity from '@/components/Profile/MuscleIntensity/MuscleIntensity';
import ProfileInsightsCard from '@/components/Profile/ProfileInsights/ProfileInsightsCard';
import ProfileMainInfo from '@/components/Profile/ProfileMainInfo';
import { ScrollView, View } from '@/components/Themed';
import Title from '@/components/Title';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Title 
                title="TrackLifts"
            />
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <ProfileMainInfo/>
                <MuscleIntensity/>
                <View style={styles.insightContainer}>
                    <ProfileInsightsCard/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    scrollContainer: {
        paddingTop: 4, 
        marginBottom: 83
    },
    insightContainer: {
        paddingHorizontal: 8,
        paddingBottom: 8,
    }
});