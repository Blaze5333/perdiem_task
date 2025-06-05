/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TimeSlotItem from './TimeSlotItem';
import { colors } from '../constants/colors';


const TimePickerModal = ({ 
  selectedDate, 
  timeSlots, 
  selectedTime, 
  onSelectTime 
}) => {
  if (!selectedDate) return null;
  
  return (
    <>
      <Text style={styles.selectedDateText}>
        {selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      <ScrollView style={styles.modalScroll}>
        <View style={styles.timeSlotGrid}>
          {timeSlots.map((slot, index) => (
            <TimeSlotItem
              key={index}
              slot={slot}
              selectedTime={selectedTime}
              onPress={() => onSelectTime(slot.time)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginVertical: 12,
    textAlign: 'center',
  },
  modalScroll: {
    paddingVertical: 8,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 4,
  },
});

export default TimePickerModal;
