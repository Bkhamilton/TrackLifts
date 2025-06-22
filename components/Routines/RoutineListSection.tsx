import RoutineCard from '@/components/Home/RoutineCard';
import { Text } from '@/components/Themed';
import { ActiveRoutine } from '@/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialCommunityIconsGlyphs from "@expo/vector-icons/build/MaterialCommunityIcons";
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type Props = {
    title: string;
    icon: keyof typeof MaterialCommunityIconsGlyphs.glyphMap;
    iconColor: string;
    routines: ActiveRoutine[];
    isFavorite: boolean;
    openRoutine: (routine: ActiveRoutine) => void;
    openRoutineOptions: (routine: ActiveRoutine) => void;
    emptyText: string;
    listHeight?: number;
};

export default function RoutineListSection({
    title,
    icon,
    iconColor,
    routines,
    isFavorite,
    openRoutine,
    openRoutineOptions,
    emptyText,
    listHeight,
}: Props) {
    return (
        <View>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
                <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
            <FlatList
                data={routines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.routineItem}>
                        <RoutineCard
                            routine={item}
                            open={openRoutine}
                            openRoutineOptions={openRoutineOptions}
                            isFavorite={isFavorite}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>{emptyText}</Text>
                }
                style={listHeight ? [{ height: listHeight }] : undefined}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    routineItem: {
        paddingVertical: 6,
        backgroundColor: 'transparent',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 12,
        fontStyle: 'italic',
    },
});