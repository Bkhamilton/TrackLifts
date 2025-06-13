import { Text, TextInput, View } from '@/components/Themed';
import { DBContext } from '@/contexts/DBContext'; // Assuming DBContext provides routines
import { Exercise } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface SearchExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (routine: Exercise) => void;
}

export default function SearchExerciseModal({ 
    visible, 
    onClose, 
    onSelect 
}: SearchExerciseModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const { exercises } = useContext(DBContext); // Assuming DBContext provides routines

    const filteredExercises = exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons 
                        name="magnify" 
                        size={24} 
                        color="#999" 
                        style={styles.searchIcon} 
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Results List */}
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.routineItem}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.routineTitle}>{item.title}</Text>
                            <Text style={styles.routineDetails}>
                                {item.muscleGroup} | {item.equipment}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No exercises found</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    cancelText: {
        color: '#ff8787',
        fontSize: 16,
        marginLeft: 10,
    },
    routineItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    routineTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    routineDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    listContent: {
        paddingBottom: 20,
    },
});