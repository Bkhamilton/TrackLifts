import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../Themed';

interface Option {
    label: string;
    value: string;
    destructive?: boolean;
}

interface OptionsModalProps {
    visible: boolean;
    close: () => void;
    title: string;
    options: Option[];
    onSelect: (value: string) => void;
}

export default function OptionsModal({
    visible,
    close,
    title,
    options,
    onSelect,
}: OptionsModalProps) {
    const handleSelect = (value: string) => {
        onSelect(value);
        close();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalPopup}>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                            <View style={{ paddingHorizontal: 6 }}>
                                <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
                            </View>
                        </View>
                        {options.map((option) => (
                            <View key={option.value}>
                                <TouchableOpacity
                                    onPress={() => handleSelect(option.value)}
                                >
                                    <View style={styles.optionButtons}>
                                        <Text
                                            style={[
                                                styles.optionText,
                                                option.destructive && { color: 'red' }
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalPopup: {
        width: '70%',
        bottom: '10%',
        elevation: 30,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 8,
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionButtons: {
        alignItems: 'center',
        paddingVertical: 2,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    }
});