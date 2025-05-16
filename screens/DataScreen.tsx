import GraphInfo from '@/components/Data/GraphInfo';
import { View } from '@/components/Themed';
import Title from '@/components/Title';
import { StyleSheet } from 'react-native';

export default function DataScreen() {
    return (
        <View style={styles.container}>
            <Title 
                title="Data"
            />
            <View style={styles.scrollContainer}>
                <GraphInfo/>
            </View>
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