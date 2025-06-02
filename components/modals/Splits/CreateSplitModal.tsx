import { Text, TextInput, View } from '@/components/Themed';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface CreateSplitModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: () => void;
    splitName: string;
    setSplitName: (name: string) => void;
}

export default function CreateSplitModal({
    visible,
    onClose,
    onCreate,
    splitName,
    setSplitName,
}: CreateSplitModalProps) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Split</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Split Name"
                        value={splitName}
                        onChangeText={setSplitName}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={onCreate}
                            disabled={!splitName}
                        >
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    createButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#ff8787',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});
