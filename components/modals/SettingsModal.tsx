import { Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface SettingsModalProps {
    visible: boolean;
    close: () => void;
    onSelect: (option: string) => void
}

export default function SettingsModal({ 
    visible, 
    close, 
    onSelect,
}: SettingsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalPopup}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Settings</Text>
                        <TouchableOpacity onPress={close} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#ff8787" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Profile Settings Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profile Settings</Text>
                            <TouchableOpacity 
                                onPress={() => onSelect('editProfile')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="account" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Edit Profile Information</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={() => onSelect('editGoals')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="target" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Edit Fitness Goals</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* App Settings Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>App Settings</Text>
                            <TouchableOpacity 
                                onPress={() => onSelect('notificationSettings')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="bell" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Notification Settings</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={() => onSelect('appearanceSettings')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="palette" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Appearance</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Privacy & Security Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Privacy & Security</Text>
                            <TouchableOpacity 
                                onPress={() => onSelect('privacySettings')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="lock" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Privacy Settings</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Other Actions Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Actions</Text>
                            <TouchableOpacity
                                onPress={() => onSelect('exportData')} 
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="export" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Export Workout Data</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={() => onSelect('clearData')} 
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="restore" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Reset All Data</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => onSelect('helpSupport')}
                                style={styles.settingButton}
                            >
                                <View style={styles.buttonContent}>
                                    <MaterialCommunityIcons name="help-circle" size={20} color="#ff8787" />
                                    <Text style={styles.buttonText}>Help & Support</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPopup: {
        width: '90%',
        height: '70%',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 12,
        paddingLeft: 8,
    },
    settingButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 12,
    },
});