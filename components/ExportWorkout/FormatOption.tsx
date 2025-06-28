import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface FormatOptionProps {
    label: string;
    icon: IconName;
    active: boolean;
}

export default function FormatOption({ label, icon, active }: FormatOptionProps) {
    return (
        <View style={[styles.formatOption, active && styles.activeFormat]}>
            <MaterialCommunityIcons name={icon} size={20} color={active ? '#ff8787' : '#666'} />
            <Text style={[styles.formatLabel, active && styles.activeFormatLabel]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    formatOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    activeFormat: {
        borderColor: '#ff8787',
        backgroundColor: 'rgba(255, 135, 135, 0.1)',
    },
    formatLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    activeFormatLabel: {
        color: '#ff8787',
        fontWeight: '500',
    },
});