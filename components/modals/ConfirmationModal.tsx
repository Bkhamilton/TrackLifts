import { ClearView, Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    message: string;
    onClose: () => void;
    onSelect: (choice: 'yes' | 'no') => void;
}

export default function ConfirmationModal({
    visible,
    message,
    onClose,
    onSelect
}: ConfirmationModalProps) {

    const grayText = useThemeColor({}, 'grayText');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={[styles.message, { color: grayText }]}>{message}</Text>

                    <ClearView style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.noButton]}
                            onPress={() => {
                                onSelect('no');
                                onClose();
                            }}
                        >
                            <Text style={[styles.buttonText, { color: 'black' }]}>No</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.yesButton]}
                            onPress={() => {
                                onSelect('yes');
                                onClose();
                            }}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                    </ClearView>
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
        borderRadius: 12,
        padding: 20,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    yesButton: {
        backgroundColor: '#ff8787',
        marginLeft: 10,
    },
    noButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});