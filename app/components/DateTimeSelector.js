/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * DateTimeSelector component
 * Shows a date selection button and handles selections
 */
const DateTimeSelector = ({ selectedDate, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Select Date & Time</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.dateButtonContent}>
          <Text style={styles.dateButtonIcon}>📅</Text>
          <Text style={styles.dateButtonText}>
            {selectedDate 
              ? selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : 'Choose a date'
            }
          </Text>
        </View>
        <Text style={styles.dateButtonArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.gray800,
  },
  dateButtonArrow: {
    fontSize: 18,
    color: colors.gray500,
  },
});

export default DateTimeSelector;
