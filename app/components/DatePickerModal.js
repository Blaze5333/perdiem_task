/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../constants/colors';


/**
 * Date item component for date selection
 */
const DateItem = ({ date, onSelect, isToday, isTomorrow }) => {
  return (
    <TouchableOpacity
      style={styles.dateItem}
      onPress={() => onSelect(date)}
      activeOpacity={0.8}
    >
      <View style={styles.dateItemContent}>
        <Text style={styles.dateItemText}>
          {date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        {(isToday || isTomorrow) && (
          <Text style={styles.dateItemLabel}>
            {isToday ? 'Today' : 'Tomorrow'}
          </Text>
        )}
      </View>
      <Text style={styles.dateItemArrow}>→</Text>
    </TouchableOpacity>
  );
};

/**
 * DatePicker modal content
 */
const DatePickerModal = ({ dates, onSelectDate }) => {
  return (
    <ScrollView style={styles.modalScroll}>
      {dates.map((date, index) => (
        <DateItem
          key={index}
          date={date}
          onSelect={(date) => onSelectDate(date)}
          isToday={index === 0}
          isTomorrow={index === 1}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalScroll: {
    paddingVertical: 8,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  dateItemContent: {
    flex: 1,
  },
  dateItemText: {
    fontSize: 16,
    color: colors.gray800,
  },
  dateItemLabel: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  dateItemArrow: {
    fontSize: 18,
    color: colors.gray500,
  },
});

export default DatePickerModal;
