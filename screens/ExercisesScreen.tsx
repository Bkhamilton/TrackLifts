import { DBContext } from '@/contexts/DBContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseList from '../components/Exercises/ExerciseList';
import { View } from '../components/Themed';
import Title from '../components/Title';

export default function ExercisesScreen() {
    const { exercises } = useContext(DBContext);

    return (
        <View style={styles.container}>
            <View style={{ top:60 }}>
                <Title title="Exercises"></Title>
                <TouchableOpacity
                    style = {styles.plusButton}
                >
                    <View>
                        <MaterialCommunityIcons name="plus" size={24} color="#ff8787" />
                    </View>  
                </TouchableOpacity>
            </View>
            <View style={{ top: 60, paddingTop: 10 }}>
                <ExerciseList 
                    exercises={exercises} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    plusButton: {
        position: 'absolute',
        right: 18,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: '90%',
    },
});