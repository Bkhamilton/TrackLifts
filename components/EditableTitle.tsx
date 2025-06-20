import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import TitleChangeModal from './modals/TitleChangeModal';

interface EditableTitleProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
}

export default function EditableTitle({
    title,
    onTitleChange,
    leftContent,
    rightContent,
}: EditableTitleProps) {
    const [modalVisible, setModalVisible] = useState(false);

    // Determine font size based on title length
    const getFontSize = (length: number) => {
        if (length <= 18) return 18;
        if (length <= 32) return 14;
        return 12;
    };
    const fontSize = getFontSize(title.length);

    return (
        <>
            <View style={styles.outerContainer}>
                <View style={styles.container}>
                    <View style={styles.leftContent}>
                        {leftContent ? leftContent : null}
                    </View>
                    <TouchableOpacity
                        style={styles.titleContainer}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.title, { fontSize }]} numberOfLines={1} ellipsizeMode="tail">
                            {title}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.rightContent}>
                        {rightContent ? rightContent : null}
                    </View>
                </View>
                <View style={styles.separator} lightColor="#e3dada" darkColor="rgba(255,255,255,0.1)" />
            </View>
            <TitleChangeModal
                visible={modalVisible}
                initialTitle={title}
                onSave={(newTitle) => {
                    setModalVisible(false);
                    if (newTitle && newTitle !== title) {
                        onTitleChange(newTitle);
                    }
                }}
                onCancel={() => setModalVisible(false)}
            />
        </>
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
        fontWeight: 'bold',
    },
    separator: {
        marginTop: 10,
        height: 1,
        width: 350,
    },
});