import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Switch, TouchableOpacity } from 'react-native';

interface PrivacySettingsModalProps {
    visible: boolean;
    close: () => void;
}

export default function PrivacySettingsModal({ visible, close }: PrivacySettingsModalProps) {
    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: true,
        workoutHistoryVisible: true,
        analyticsSharing: false,
        personalizedAds: false,
    });

    const toggleSetting = (setting: keyof typeof privacySettings) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

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
                        <Text style={styles.title}>Privacy Settings</Text>
                        <TouchableOpacity onPress={close}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Public Profile</Text>
                            <Text style={styles.settingDescription}>
                                Allow others to view your profile and basic stats
                            </Text>
                        </View>
                        <Switch
                            value={privacySettings.profileVisible}
                            onValueChange={() => toggleSetting('profileVisible')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Workout History</Text>
                            <Text style={styles.settingDescription}>
                                Share your completed workouts with friends
                            </Text>
                        </View>
                        <Switch
                            value={privacySettings.workoutHistoryVisible}
                            onValueChange={() => toggleSetting('workoutHistoryVisible')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Analytics Sharing</Text>
                            <Text style={styles.settingDescription}>
                                Help improve the app by sharing anonymous usage data
                            </Text>
                        </View>
                        <Switch
                            value={privacySettings.analyticsSharing}
                            onValueChange={() => toggleSetting('analyticsSharing')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Personalized Ads</Text>
                            <Text style={styles.settingDescription}>
                                Show ads based on your workout preferences
                            </Text>
                        </View>
                        <Switch
                            value={privacySettings.personalizedAds}
                            onValueChange={() => toggleSetting('personalizedAds')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton}>
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
        backgroundColor: 'white',
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
        color: '#333',
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
});