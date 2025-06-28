import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Switch } from 'react-native';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface ExportOptionProps {
    label: string;
    icon: IconName;
    value: boolean;
    onToggle: () => void;
    description: string;
}

export default function ExportOption({
    label,
    icon,
    value,
    onToggle,
    description
}: ExportOptionProps) {
    return (
        <View style={styles.optionContainer}>
            <View style={styles.optionLeft}>
                <MaterialCommunityIcons name={icon} size={20} color="#666" />
                <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{label}</Text>
                    <Text style={styles.optionDescription}>{description}</Text>
                </View>
            </View>
            <Switch 
                value={value}
                onValueChange={onToggle}
                thumbColor="#fff"
                trackColor={{ false: '#ddd', true: '#ff8787' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    optionText: {
        marginLeft: 12,
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 12,
        color: '#666',
    },
});