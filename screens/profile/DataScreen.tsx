import MiniSparkline from '@/components/Data/MiniSparkline';
import StrengthProgressChart from '@/components/Data/StrengthProgressChart';
import WorkoutFrequencyChart from '@/components/Data/WorkoutFrequencyChart';
import { ScrollView, Text, View } from '@/components/Themed';
import Title from '@/components/Title';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function DataScreen() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Title 
                title="Data"
                leftContent={
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/(tabs)/profile/main');
                        }}
                        style={{ marginRight: 12 }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                }
                rightContent={
                    <MiniSparkline data={[
                        { x: 1, y: 2 },
                        { x: 2, y: 3 },
                        { x: 3, y: 5 },
                        { x: 4, y: 4 },
                        { x: 5, y: 6 }
                    ]} />
                }
            />
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Workout Analytics
            </Text>
            
            <View style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>Weekly Frequency</Text>
                <WorkoutFrequencyChart />
            </View>
            
            <View style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>Bench Press Progress</Text>
                <StrengthProgressChart />
            </View>
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
        paddingTop: 10,
    }
});