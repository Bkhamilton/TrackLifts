import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clears all data from AsyncStorage.
 */
export async function clearAllStorage() {
    try {
        await AsyncStorage.clear();
        console.log('All AsyncStorage data cleared.');
    } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
    }
}