import { Text, TextInput, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type EditHistoryCardProps = {
    startTime: string;
    lengthMin: string;
    onChangeStartTime: (text: string) => void;
    onChangeLengthMin: (text: string) => void;
};

export default function EditHistoryCard({
    startTime,
    lengthMin,
    onChangeStartTime,
    onChangeLengthMin,
}: EditHistoryCardProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(startTime || Date.now()));

    // Format the date for display
    const formattedDate = selectedDate.toLocaleDateString();
    const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle date selection
    const handleDateConfirm = (date: Date) => {
        setSelectedDate(date);
        onChangeStartTime(date.toISOString());
        setShowDatePicker(false);
    };

    // Handle time selection
    const handleTimeConfirm = (time: Date) => {
        const newDateTime = new Date(selectedDate);
        newDateTime.setHours(time.getHours());
        newDateTime.setMinutes(time.getMinutes());
        setSelectedDate(newDateTime);
        onChangeStartTime(newDateTime.toISOString());
        setShowTimePicker(false);
    };

    // Format duration input (HH:MM:SS)
    const handleDurationChange = (text: string) => {
        // Remove all non-digit characters
        const digitsOnly = text.replace(/\D/g, '');
        
        // Format as HH:MM:SS
        let formatted = '';
        if (digitsOnly.length > 0) {
            formatted = digitsOnly.substring(0, 2);
            if (digitsOnly.length > 2) {
                formatted += ':' + digitsOnly.substring(2, 4);
                if (digitsOnly.length > 4) {
                    formatted += ':' + digitsOnly.substring(4, 6);
                }
            }
        }
        
        onChangeLengthMin(formatted);
    };

    return (
        <View style={styles.container}>
            {/* Start Time Section */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.label}>Start Time</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.label}>Length</Text>
                    <Text style={styles.smallLabel}>(HH:MM:SS)</Text>
                </View>
            </View>
            <View style={styles.timeInputContainer}>
                <TouchableOpacity 
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                >
                    <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.timeInput}
                    onPress={() => setShowTimePicker(true)}
                >
                    <MaterialCommunityIcons name="clock" size={20} color="#666" />
                    <Text style={styles.dateText}>{formattedTime}</Text>
                </TouchableOpacity>

                {/* Duration Section */}
                <TextInput
                    style={styles.durationInput}
                    value={lengthMin}
                    onChangeText={handleDurationChange}
                    placeholder="00:00:00"
                    keyboardType="numeric"
                    maxLength={8} // HH:MM:SS
                />
            </View>

            {/* Date Picker Modal */}
            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                date={selectedDate}
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(false)}
            />

            {/* Time Picker Modal */}
            <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                date={selectedDate}
                onConfirm={handleTimeConfirm}
                onCancel={() => setShowTimePicker(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 13,
        color: '#333',
    },
    smallLabel: {
        fontSize: 10,
        color: '#666',
        marginLeft: 4,
        marginBottom: 6,
    },
    timeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    durationInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
        fontSize: 14,
        textAlign: 'right',
    },
});