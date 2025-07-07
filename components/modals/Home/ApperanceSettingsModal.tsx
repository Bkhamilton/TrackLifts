import { Text, View } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, Switch, TouchableOpacity } from 'react-native';

interface AppearanceSettingsModalProps {
    visible: boolean;
    close: () => void;
}

export default function AppearanceSettingsModal({ visible, close }: AppearanceSettingsModalProps) {
    const [appearanceSettings, setAppearanceSettings] = useState({
        lightMode: true,
        usePhoneMode: true,
        weightMetric: true, // Default to pounds
    });

    const { setAppearancePreference } = useContext(UserContext);

    const toggleSetting = (setting: keyof typeof appearanceSettings) => {
        // Prevent toggling lightMode if usePhoneMode is true
        if (setting === 'lightMode' && appearanceSettings.usePhoneMode) return;
        setAppearanceSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSave = () => {
        // Here you would typically save the settings to a context or global state
        if (!appearanceSettings.usePhoneMode) {
            setAppearancePreference(appearanceSettings.lightMode ? 'light' : 'dark');
        } else {
            setAppearancePreference('system');
        }
        close();
    }

    const grayText = useThemeColor({}, 'grayText');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={close}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Appearance</Text>
                        <TouchableOpacity onPress={close}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: grayText }]}>Theme Settings</Text>
                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Light Mode</Text>
                                <Text style={styles.settingDescription}>
                                    Enable light mode for the app interface
                                </Text>
                            </View>
                            <Switch
                                value={appearanceSettings.lightMode}
                                onValueChange={() => toggleSetting('lightMode')}
                                thumbColor="#fff"
                                trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                                disabled={appearanceSettings.usePhoneMode}
                                style={appearanceSettings.usePhoneMode ? { opacity: 0.5 } : {}}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Use Default</Text>
                                <Text style={styles.settingDescription}>
                                    Use the default phone mode
                                </Text>
                            </View>
                            <Switch
                                value={appearanceSettings.usePhoneMode}
                                onValueChange={() => toggleSetting('usePhoneMode')}
                                thumbColor="#fff"
                                trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                            />
                        </View>
                    </View>

                    {/* <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: grayText }]}>Other Settings</Text>
                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Weight Metric</Text>
                                <Text style={styles.settingDescription}>
                                    Use {appearanceSettings.weightMetric ? 'pounds' : 'kilograms'} as the weight measurement unit
                                </Text>
                            </View>
                            <Switch
                                value={appearanceSettings.weightMetric}
                                onValueChange={() => toggleSetting('weightMetric')}
                                thumbColor="#fff"
                                trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                            />
                        </View>
                    </View> */}

                    <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleSave}    
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#666',
        maxWidth: '80%',
    },
    saveButton: {
        backgroundColor: '#ff8787',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
});