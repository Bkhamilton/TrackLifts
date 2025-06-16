import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface HelpSupportModalProps {
    visible: boolean;
    close: () => void;
}

export default function HelpSupportModal({ visible, close }: HelpSupportModalProps) {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
        account: false,
        workouts: false,
        data: false,
    });

    const toggleItem = (item: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:hamiltondevstudios@gmail.com');
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
                        <Text style={styles.title}>Help & Support</Text>
                        <TouchableOpacity onPress={close}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <DisclosureItem
                        title="Account Issues"
                        expanded={expandedItems.account}
                        onPress={() => toggleItem('account')}
                    >
                        <Text style={styles.disclosureContent}>
                            If you're having trouble with your account, try resetting your password. 
                            For security issues, contact our support team immediately.
                        </Text>
                    </DisclosureItem>

                    <DisclosureItem
                        title="Workout Tracking"
                        expanded={expandedItems.workouts}
                        onPress={() => toggleItem('workouts')}
                    >
                        <Text style={styles.disclosureContent}>
                            To track a workout, go to the workout screen and press the '+' button. 
                            Make sure your app has the latest updates for all tracking features.
                        </Text>
                    </DisclosureItem>

                    <DisclosureItem
                        title="Data & Privacy"
                        expanded={expandedItems.data}
                        onPress={() => toggleItem('data')}
                    >
                        <Text style={styles.disclosureContent}>
                            Your data is stored securely and never shared without permission. 
                            You can adjust privacy settings at any time from your profile.
                        </Text>
                    </DisclosureItem>

                    <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={handleContactSupport}
                    >
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#ff8787" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function DisclosureItem({ 
    title, 
    children, 
    expanded, 
    onPress 
}: { 
    title: string; 
    children: React.ReactNode; 
    expanded: boolean; 
    onPress: () => void 
}) {
    return (
        <View style={styles.disclosureContainer}>
            <TouchableOpacity 
                style={styles.disclosureHeader}
                onPress={onPress}
            >
                <Text style={styles.disclosureTitle}>{title}</Text>
                <MaterialIcons 
                    name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    size={24} 
                    color="#666" 
                />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.disclosureBody}>
                    {children}
                </View>
            )}
        </View>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    disclosureContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 12,
    },
    disclosureHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    disclosureTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    disclosureBody: {
        paddingBottom: 12,
    },
    disclosureContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 12,
    },
    contactButtonText: {
        color: '#ff8787',
        fontWeight: '600',
        fontSize: 16,
    },
});