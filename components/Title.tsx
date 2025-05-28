import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';

interface TitleProps {
    title: string;
    leftContent?: ReactNode; // Optional left content
    rightContent?: ReactNode; // Optional right content
}

export default function Title({ title, leftContent, rightContent }: TitleProps) {
    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                {/* Render leftContent */}
                <View style={styles.leftContent}>
                    {leftContent ? leftContent : null}
                </View>

                {/* Centered Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                {/* Render rightContent */}
                <View style={styles.rightContent}>
                    {rightContent ? rightContent : null}
                </View>
            </View>
            <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        paddingTop: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 42,
        width: '100%',
    },
    leftContent: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContent: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    titleContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginTop: 10,
        height: 1,
        width: 350,
    },
});