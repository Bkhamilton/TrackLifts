import { Text, TextInput, View } from '@/components/Themed';
import DatePickerModal from '@/components/modals/DatePickerModal';
import TimePickerModal from '@/components/modals/TimePickerModal';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type EditHistoryCardProps = {
    startTime: string;
    endTime: string;
    onChangeStartTime: (text: string) => void;
    onChangeEndTime: (text: string) => void;
};

export default function EditHistoryCard({
    startTime,
    endTime,
    onChangeStartTime,
    onChangeEndTime,
}: EditHistoryCardProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(startTime || Date.now()));

    // Format the date for display
    const formattedDate = selectedDate.toLocaleDateString();
    const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const cardBackground = useThemeColor({}, 'grayBackground');
    const cardBorder = useThemeColor({}, 'grayBorder');

    // Handle date selection
    const handleDateConfirm = (date: Date) => {
        // Preserve the current time when changing the date
        const newDateTime = new Date(date);
        newDateTime.setHours(selectedDate.getHours());
        newDateTime.setMinutes(selectedDate.getMinutes());
        newDateTime.setSeconds(selectedDate.getSeconds());
        setSelectedDate(newDateTime);
        onChangeStartTime(newDateTime.toISOString());
    };

    // Handle time selection
    const handleTimeConfirm = (time: Date) => {
        // Preserve the current date when changing the time
        const newDateTime = new Date(selectedDate);
        newDateTime.setHours(time.getHours());
        newDateTime.setMinutes(time.getMinutes());
        newDateTime.setSeconds(0);
        newDateTime.setMilliseconds(0);
        setSelectedDate(newDateTime);
        onChangeStartTime(newDateTime.toISOString());
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
        
        onChangeEndTime(formatted);
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
                    style={[styles.dateInput, { backgroundColor: cardBackground, borderColor: cardBorder }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.timeInput, { backgroundColor: cardBackground, borderColor: cardBorder }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <MaterialCommunityIcons name="clock" size={20} color="#666" />
                    <Text style={styles.dateText}>{formattedTime}</Text>
                </TouchableOpacity>

                {/* Duration Section */}
                <TextInput
                    style={[styles.durationInput, { backgroundColor: cardBackground, borderColor: cardBorder }]}
                    value={endTime}
                    onChangeText={handleDurationChange}
                    placeholder="00:00:00"
                    keyboardType="numeric"
                    maxLength={8} // HH:MM:SS
                />
            </View>

            {/* Date Picker Modal */}
            <DatePickerModal
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                initialDate={selectedDate}
                onDateSelected={handleDateConfirm}
                mode="start"
            />

            {/* Time Picker Modal */}
            <TimePickerModal
                visible={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                initialTime={selectedDate}
                onTimeSelected={handleTimeConfirm}
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