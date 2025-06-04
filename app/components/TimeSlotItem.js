/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/colors';


const { width } = Dimensions.get('window');

/**
 * TimeSlotItem component for displaying a single time slot
 * @param {Object} props - Component props
 * @param {Object} props.slot - The time slot data
 * @param {string} props.selectedTime - Currently selected time
 * @param {Function} props.onPress - Function to call when the time slot is pressed
 */
const TimeSlotItem = ({ slot, selectedTime, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        selectedTime === slot.time && styles.selectedTimeSlot,
        !slot.isOpen && styles.closedTimeSlot
      ]}
      onPress={() => onPress(slot.time)}
      activeOpacity={0.8}
    >
      <View style={styles.timeSlotContent}>
        <View style={[
          styles.timeStatusDot,
          slot.isOpen ? styles.openDot : styles.closedDot
        ]} />
        <Text style={[
          styles.timeSlotText,
          selectedTime === slot.time && styles.selectedTimeSlotText,
          !slot.isOpen && styles.closedTimeSlotText
        ]}>
          {slot.formattedTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeSlot: {
    width: (width - 64) / 3 - 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  openDot: {
    backgroundColor: '#4CAF50', // Green
  },
  closedDot: {
    backgroundColor: '#F44336', // Red
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedTimeSlotText: {
    color: colors.white,
    fontWeight: '600',
  },
  closedTimeSlot: {
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
  },
  closedTimeSlotText: {
    color: colors.gray400,
  },
});

export default TimeSlotItem;
