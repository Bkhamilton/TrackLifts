import { Text, View } from '@/components/Themed';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';

interface RoutineMismatchModalProps {
    visible: boolean;
    completedRoutineTitle: string;
    expectedRoutineName: string;
    routineOptions: any[];
    selectedRoutineId: number | null;
    setSelectedRoutineId: (id: number | null) => void;
    onContinue: () => void;
    onClose: () => void;
}

const RoutineMismatchModal: React.FC<RoutineMismatchModalProps> = ({
    visible,
    completedRoutineTitle,
    expectedRoutineName,
    routineOptions,
    selectedRoutineId,
    setSelectedRoutineId,
    onContinue,
    onClose,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 24,
                width: '85%',
                alignItems: 'center'
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
                    You completed "{completedRoutineTitle}"
                </Text>
                <Text style={{ marginBottom: 16 }}>
                    The expected routine for today was "{expectedRoutineName}".
                </Text>
                <Text style={{ marginBottom: 8 }}>
                    Which routine in your split does this most resemble?
                </Text>
                {routineOptions.map(opt => (
                    <TouchableOpacity
                        key={opt.routine_id}
                        style={{
                            backgroundColor: selectedRoutineId === opt.routine_id ? '#ff8787' : '#eee',
                            padding: 10,
                            borderRadius: 8,
                            marginVertical: 4,
                            width: '100%',
                            alignItems: 'center'
                        }}
                        onPress={() => setSelectedRoutineId(opt.routine_id)}
                    >
                        <Text style={{
                            color: selectedRoutineId === opt.routine_id ? 'white' : '#333'
                        }}>
                            {opt.routine_name || opt.routine}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={{
                        backgroundColor: selectedRoutineId === null ? '#ff8787' : '#eee',
                        padding: 10,
                        borderRadius: 8,
                        marginVertical: 4,
                        width: '100%',
                        alignItems: 'center'
                    }}
                    onPress={() => setSelectedRoutineId(null)}
                >
                    <Text style={{
                        color: selectedRoutineId === null ? 'white' : '#333'
                    }}>
                        No Routine
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        marginTop: 16,
                        backgroundColor: '#4CAF50',
                        borderRadius: 8,
                        padding: 12,
                        width: '100%',
                        alignItems: 'center'
                    }}
                    onPress={onContinue}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

export default RoutineMismatchModal;