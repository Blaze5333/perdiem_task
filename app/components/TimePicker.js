/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';

const TimePicker = ({ timeSlots, selectedTime, onSelectTime }) => {
  if (!timeSlots || timeSlots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Time</Text>
        <Text style={styles.noTimesText}>
          No available time slots for the selected date.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {timeSlots.map((slot, index) => {
          const isSelected = selectedTime && selectedTime === slot.time;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeItem,
                isSelected && styles.selectedTimeItem
              ]}
              onPress={() => onSelectTime(slot.time, slot.dateTime)}
            >
              <Text style={[
                styles.timeText,
                isSelected && styles.selectedTimeText
              ]}>
                {slot.formattedTime}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.gray900,
  },
  scrollContent: {
    paddingRight: 20,
  },
  timeItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray800,
  },
  selectedTimeText: {
    color: colors.white,
  },
  noTimesText: {
    color: colors.gray600,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

export default TimePicker;
