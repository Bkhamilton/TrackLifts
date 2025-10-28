import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface OnboardingModalProps {
    visible: boolean;
    onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
    name: string;
    username: string;
    height: string;
    weight: string;
    bodyFat: string;
    favoriteExercise: string;
}

export default function OnboardingModal({
    visible,
    onComplete
}: OnboardingModalProps) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const grayText = useThemeColor({}, 'grayText');
    const borderColor = useThemeColor({}, 'grayBorder');

    const [formData, setFormData] = useState<OnboardingData>({
        name: '',
        username: '',
        height: '',
        weight: '',
        bodyFat: '',
        favoriteExercise: '',
    });

    const handleChange = (field: keyof OnboardingData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleComplete = () => {
        // Validate required fields
        if (!formData.name || !formData.username) {
            alert('Please fill in at least your name and username');
            return;
        }
        onComplete(formData);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <KeyboardAvoidingView 
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.modalContent, { backgroundColor }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="weight-lifter" size={48} color="#ff8787" />
                        <Text style={styles.title}>Welcome to TrackLifts!</Text>
                        <Text style={[styles.subtitle, { color: grayText }]}>
                            Let&apos;s get you set up. Tell us about yourself:
                        </Text>
                    </View>

                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Name Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name *</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="Enter your name"
                                placeholderTextColor={grayText}
                                value={formData.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                        </View>

                        {/* Username Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username *</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="Choose a username"
                                placeholderTextColor={grayText}
                                value={formData.username}
                                onChangeText={(text) => handleChange('username', text)}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Height Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Height</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="e.g., 5'10&quot; or 178 cm"
                                placeholderTextColor={grayText}
                                value={formData.height}
                                onChangeText={(text) => handleChange('height', text)}
                            />
                        </View>

                        {/* Weight Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Weight</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="e.g., 180 lbs or 82 kg"
                                placeholderTextColor={grayText}
                                value={formData.weight}
                                onChangeText={(text) => handleChange('weight', text)}
                            />
                        </View>

                        {/* Body Fat % Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Body Fat %</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="e.g., 15%"
                                placeholderTextColor={grayText}
                                value={formData.bodyFat}
                                onChangeText={(text) => handleChange('bodyFat', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Favorite Exercise Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Favorite Exercise</Text>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor }]}
                                placeholder="e.g., Bench Press"
                                placeholderTextColor={grayText}
                                value={formData.favoriteExercise}
                                onChangeText={(text) => handleChange('favoriteExercise', text)}
                            />
                        </View>

                        <Text style={[styles.footnote, { color: grayText }]}>
                            * Required fields
                        </Text>
                    </ScrollView>

                    {/* Complete Button */}
                    <TouchableOpacity 
                        style={styles.completeButton}
                        onPress={handleComplete}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        flex: 1,
        marginTop: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    footnote: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 16,
    },
    completeButton: {
        backgroundColor: '#ff8787',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
