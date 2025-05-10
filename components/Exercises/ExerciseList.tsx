import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Exercise } from '@/utils/types';

export default function ExerciseList( { exercises } : { exercises: Exercise[] } ) {

    const [typeBold, setTypeBold] = useState( false );
    const [muscleGroupBold, setMuscleGroupBold] = useState( false );

    /*
    function toggleTypeBold() {
        setTypeBold(!typeBold);
        if (!typeBold) {
            sortList({type: "Type"})
        } else {
            clearSort();
        }
    }

    function toggleMGBold() {
        setMuscleGroupBold(!muscleGroupBold);
        if (!muscleGroupBold) {
            sortList({ type: "Muscle Group" })
        } else {
            clearSort();
        }
    }
    */

    return (
        <View style={styles.container}>
            <View style={styles.sortButtonsContainer}>
                <TouchableOpacity
                
                >
                    <View style={styles.sortButtons}>
                        <Text style={{fontWeight: (typeBold) ? "600" : "400"}}>Type</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                
                >
                    <View style={styles.sortButtons}>
                        <Text style={{fontWeight: (muscleGroupBold) ? "600" : "400"}}>Muscle Group</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={exercises}
                renderItem={({ item }) => (
                    <View style={{ paddingVertical: 4, }}>
                        <TouchableOpacity
                            key={item.id}
                            
                        >
                            <View style={styles.exerciseListView}>
                                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                                <View>
                                    <Text style={{ fontWeight: '500', fontSize: 15}}>{item.muscleGroup}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        width: 350,
        height: '85%',
    },
    sortButtons: {
        width: 120,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#ff8787'
    },
    sortButtonsContainer: {
        flexDirection: "row" , 
        marginLeft: 20, 
        justifyContent: 'space-evenly', 
        paddingBottom: 9, 
        paddingTop: 3,
        height: 40
    },
    exerciseListView: {
        flexDirection: 'row', 
        borderWidth: 1, 
        paddingVertical: 4, 
        paddingHorizontal: 6, 
        justifyContent: 'space-between'
    },
});
