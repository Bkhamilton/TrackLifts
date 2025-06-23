import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Switch, TouchableOpacity } from 'react-native';

interface NotificationSettingsModalProps {
    visible: boolean;
    close: () => void;
}

export default function NotificationSettingsModal({ visible, close }: NotificationSettingsModalProps) {
    const [notificationSettings, setNotificationSettings] = useState({
        workoutReminders: true,
        friendActivity: true,
        progressReports: true,
        featureAnnouncements: false,
        promotionalNotifications: false,
    });

    const toggleSetting = (setting: keyof typeof notificationSettings) => {
        setNotificationSettings(prev => ({
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
                        <Text style={styles.title}>Notification Settings</Text>
                        <TouchableOpacity onPress={close}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Workout Reminders</Text>
                            <Text style={styles.settingDescription}>
                                Get reminders to complete your scheduled workouts
                            </Text>
                        </View>
                        <Switch
                            value={notificationSettings.workoutReminders}
                            onValueChange={() => toggleSetting('workoutReminders')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Friend Activity</Text>
                            <Text style={styles.settingDescription}>
                                Receive notifications when friends complete workouts or interact with you
                            </Text>
                        </View>
                        <Switch
                            value={notificationSettings.friendActivity}
                            onValueChange={() => toggleSetting('friendActivity')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Weekly Progress Reports</Text>
                            <Text style={styles.settingDescription}>
                                Get a summary of your weekly workout progress
                            </Text>
                        </View>
                        <Switch
                            value={notificationSettings.progressReports}
                            onValueChange={() => toggleSetting('progressReports')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Feature Announcements</Text>
                            <Text style={styles.settingDescription}>
                                Be the first to know about new features and updates
                            </Text>
                        </View>
                        <Switch
                            value={notificationSettings.featureAnnouncements}
                            onValueChange={() => toggleSetting('featureAnnouncements')}
                            thumbColor="#fff"
                            trackColor={{ false: '#f0f0f0', true: '#ff8787' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingTitle}>Promotional Notifications</Text>
                            <Text style={styles.settingDescription}>
                                Receive special offers and promotions
                            </Text>
                        </View>
                        <Switch
                            value={notificationSettings.promotionalNotifications}
                            onValueChange={() => toggleSetting('promotionalNotifications')}
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