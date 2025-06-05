import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

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
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  dateButton: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  dateButtonArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default DateTimeSelector;
