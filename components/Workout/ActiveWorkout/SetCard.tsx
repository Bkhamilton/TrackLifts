import { Text, TextInput, View } from '@/components/Themed';
import { ActiveSet } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

interface SetCardProps {
    set: ActiveSet;
    onUpdateSet: (setId: number, field: 'weight' | 'reps', value: string) => void;
    editingSet: number | null;
    setEditingSet: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function SetCard({ set, onUpdateSet, editingSet, setEditingSet }: SetCardProps) {
    return (
        <View style={styles.setContainer}>
            <Text style={styles.setNumber}>#{set.set_order}</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={set.weight.toString()}
                    onChangeText={(value) => onUpdateSet(set.id, 'weight', value)}
                    keyboardType="numeric"
                    onFocus={() => setEditingSet(set.id)}
                    onBlur={() => setEditingSet(null)}
                />
                <Text style={styles.unit}>kg</Text>
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={set.reps.toString()}
                    onChangeText={(value) => onUpdateSet(set.id, 'reps', value)}
                    keyboardType="numeric"
                    onFocus={() => setEditingSet(set.id)}
                    onBlur={() => setEditingSet(null)}
                />
                <Text style={styles.unit}>reps</Text>
            </View>

            <View style={styles.checkContainer}>
                <MaterialCommunityIcons
                    name={editingSet === set.id ? "pencil" : "check"}
                    size={24}
                    color={editingSet === set.id ? "#007AFF" : "green"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        width: 40,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 6,
        width: 60,
        textAlign: 'center',
        marginRight: 4,
        backgroundColor: 'white',
    },
    unit: {
        fontSize: 12,
        color: '#777',
    },
    checkContainer: {
        width: 24,
        alignItems: 'center',
    },
});
