/*eslint-disable react/prop-types, react/style-prop-object */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

/**
 * NextOpeningCard component for displaying the next store opening time
 * with a notification button
 * 
 * @param {Object} props - Component props
 * @param {Object} props.nextOpening - Next opening time information object
 * @param {Function} props.onPressNotify - Function to handle notification setup
 * @param {string} props.selectedTimezone - Selected timezone ('NYC' or 'local')
 */
const NextOpeningCard = ({ nextOpening, onPressNotify, selectedTimezone }) => {
  // Only show the notification card if we have next opening info and it's local timezone
  if (!nextOpening || selectedTimezone === 'NYC') return null;
  
  const handleNotifyPress = () => {
    if (onPressNotify) {
      onPressNotify(nextOpening);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Next Store Opening</Text>
          <Text style={styles.openingTime}>{nextOpening.formattedString}</Text>
          <Text style={styles.timezoneName}>{nextOpening.inUserTimezone}</Text>
        </View>
        
        {selectedTimezone !== 'NYC' && (
          <TouchableOpacity 
            style={styles.notifyButton}
            onPress={handleNotifyPress}
          >
            <Text style={styles.notifyButtonText}>Notify Me</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  openingTime: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  timezoneName: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  notifyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  notifyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NextOpeningCard;
