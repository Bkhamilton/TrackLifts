import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
};

export default function SaveRoutineModal({ visible, onClose, onSave }: Props) {
    const [routineName, setRoutineName] = useState('');

    const handleSave = () => {
        if (routineName.trim()) {
            onSave(routineName.trim());
            setRoutineName('');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Save This Routine?</Text>
                    <Text style={styles.subtitle}>Enter a name to save this routine for future use.</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Routine Name"
                        value={routineName}
                        onChangeText={setRoutineName}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#4CAF50' }]}
                            onPress={handleSave}
                            disabled={!routineName.trim()}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '85%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#eee',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});