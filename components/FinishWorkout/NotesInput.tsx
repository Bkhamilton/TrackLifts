import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type NotesInputProps = {
    value: string;
    onChangeText: (text: string) => void;
};

export default function NotesInput({ value, onChangeText }: NotesInputProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleOpenModal = () => {
        setModalVisible(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Notes</Text>
            <TouchableOpacity onPress={handleOpenModal} activeOpacity={0.7}>
                <View style={styles.previewBox}>
                    <Text style={value ? styles.previewText : styles.placeholderText}>
                        {value || 'Leave any notes about this workout (e.g. how you felt, what to improve, etc.)'}
                    </Text>
                </View>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={handleCloseModal}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalLabel}>Notes</Text>
                        <TextInput
                            ref={inputRef}
                            style={styles.modalInput}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder="Leave any notes about this workout (e.g. how you felt, what to improve, etc.)"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            autoFocus
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 16,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
        fontSize: 16,
    },
    previewBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        backgroundColor: '#fafafa',
        justifyContent: 'center',
    },
    previewText: {
        fontSize: 15,
        color: '#222',
    },
    placeholderText: {
        fontSize: 15,
        color: '#888',
        fontStyle: 'italic',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        marginHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'stretch',
        elevation: 5,
    },
    modalLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        fontSize: 16,
        backgroundColor: '#fafafa',
        marginBottom: 18,
        textAlignVertical: 'top',
    },
    closeButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});