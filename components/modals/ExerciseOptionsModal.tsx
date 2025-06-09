import { Text, View } from '@/components/Themed';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface ExerciseOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectOption: (option: 'replace' | 'remove') => void;
}

export default function ExerciseOptionsModal({
    visible,
    onClose,
    onSelectOption
}: ExerciseOptionsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity 
                        style={styles.optionButton}
                        onPress={() => onSelectOption('replace')}
                    >
                        <Text style={styles.optionText}>Replace Exercise</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.optionButton, styles.removeButton]}
                        onPress={() => onSelectOption('remove')}
                    >
                        <Text style={[styles.optionText, styles.removeText]}>Remove Exercise</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
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
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
    },
    optionButton: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    removeButton: {
        borderBottomWidth: 0,
    },
    removeText: {
        color: '#ff6b6b',
    },
    cancelButton: {
        marginTop: 8,
        paddingVertical: 16,
    },
    cancelText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});