import { Text, TextInput, View } from '@/components/Themed';
import { Exercise } from '@/constants/types';
import { ExerciseContext } from '@/contexts/ExerciseContext';
import { useThemeColor } from '@/hooks/useThemeColor';
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
    
    const { exercises } = useContext(ExerciseContext);
    
    // Get theme-aware colors
    const iconColor = useThemeColor({}, 'icon');
    const grayTextColor = useThemeColor({}, 'grayText');
    const borderColor = useThemeColor({}, 'grayBorder');
    const tintColor = useThemeColor({}, 'tint');

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
                <View style={[styles.searchBar, { borderBottomColor: borderColor }]}>
                    <MaterialCommunityIcons 
                        name="magnify" 
                        size={24} 
                        color={iconColor} 
                        style={styles.searchIcon} 
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        placeholderTextColor={iconColor}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />
                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.cancelText, { color: tintColor }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Results List */}
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.routineItem, { borderBottomColor: borderColor }]}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.routineTitle}>{item.title}</Text>
                            <Text style={[styles.routineDetails, { color: grayTextColor }]}>
                                {item.muscleGroup} | {item.equipment}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: iconColor }]}>No exercises found</Text>
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
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
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
        fontSize: 16,
        marginLeft: 10,
    },
    routineItem: {
        padding: 15,
        borderBottomWidth: 1,
    },
    routineTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    routineDetails: {
        fontSize: 14,
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
    },
    listContent: {
        paddingBottom: 20,
    },
});