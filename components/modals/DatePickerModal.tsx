import { ClearView, Text, View } from '@/components/Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  initialDate: Date;
  onDateSelected: (date: Date) => void;
  mode: 'start' | 'end';
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  initialDate,
  onDateSelected,
  mode,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDayPress = (day: any) => {
    const newDate = new Date(day.timestamp);
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onDateSelected(selectedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ClearView style={styles.header}>
            <Text style={styles.title}>
              Select {mode === 'start' ? 'Start' : 'End'} Date
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </ClearView>

          <Calendar
            current={initialDate.toISOString().split('T')[0]}
            minDate={'2020-01-01'}
            maxDate={new Date().toISOString().split('T')[0]}
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate.toISOString().split('T')[0]]: {
                selected: true,
                selectedColor: '#ff8787',
              },
            }}
            theme={{
              arrowColor: '#ff8787',
              todayTextColor: '#ff8787',
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
            }}
          />

          <ClearView style={styles.footer}>
            <Text style={styles.selectedDate}>
              Selected: {selectedDate.toLocaleDateString()}
            </Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </ClearView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  selectedDate: {
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#ff8787',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DatePickerModal;