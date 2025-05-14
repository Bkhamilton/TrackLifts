import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sorts an array of exercises based on the given criteria.
 * @param {Array} exercises - The array of exercises to sort.
 * @param {string[]} criteria - The sorting criteria.
 * @returns {Array} - The sorted array.
 */
export function sortList(exercises, criteria) {
    let sortedArray = [...exercises]; // Create a copy of the exercises array

    sortedArray.sort((a, b) => {
        for (const criterion of criteria) {
            if (criterion === "title") {
                const result = a.title.localeCompare(b.title);
                if (result !== 0) return result;
            } else if (criterion === "equipment") {
                const result = a.equipment.localeCompare(b.equipment);
                if (result !== 0) return result;
            } else if (criterion === "muscleGroup") {
                const result = a.muscleGroup.localeCompare(b.muscleGroup);
                if (result !== 0) return result;
            }
        }
        return 0; // If all criteria are equal
    });

    return sortedArray;
}

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
