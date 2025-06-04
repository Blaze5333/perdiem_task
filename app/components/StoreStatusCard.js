/*eslint-disable*/
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

/**
 * Component to display next opening time when the store is closed
 */
const NextOpeningInfo = ({ nextOpening }) => {
  if (!nextOpening) return null;
  
  return (
    <View style={styles.nextOpeningContainer}>
      <Text style={styles.nextOpeningText}>
        Opens next: {nextOpening.formattedString}
      </Text>
      <Text style={styles.nextOpeningTzText}>
        {nextOpening.inUserTimezone}
      </Text>
    </View>
  );
};

/**
 * StoreStatusCard component showing appointment status
 * @param {Object} props - Component props
 * @param {Date} props.selectedDate - Selected date
 * @param {string} props.selectedTime - Selected time
 * @param {string} props.storeStatus - Store status ('open' or 'closed')
 * @param {Object} props.nextOpening - Next opening time information
 */
const StoreStatusCard = ({ selectedDate, selectedTime, storeStatus, nextOpening }) => {
  if (!selectedDate || !selectedTime) return null;
  
  return (
    <Animated.View 
      style={[styles.appointmentCard]}
      entering="fadeInUp"
    >
      <View style={styles.appointmentContent}>
        <View style={[
          styles.appointmentIcon,
          storeStatus === 'open' ? styles.openIcon : styles.closedIcon
        ]}>
          <Text style={styles.appointmentIconText}>
            {storeStatus === 'open' ? '✓' : '✗'}
          </Text>
        </View>
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentTitle}>
            Appointment {storeStatus === 'open' ? 'Available' : 'Unavailable'}
          </Text>
          <Text style={styles.appointmentTime}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })} at {typeof selectedTime === 'string' 
              ? selectedTime // If it's already a formatted time string
              : selectedTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })
            }
          </Text>
          <Text style={[
            styles.storeStatusText,
            storeStatus === 'open' ? styles.openText : styles.closedText
          ]}>
            NYC Store is {storeStatus.toUpperCase()} for this time
          </Text>
          
          {/* Show next opening time if store is closed */}
          {storeStatus === 'closed' && (
            <NextOpeningInfo nextOpening={nextOpening} />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openIcon: {
    backgroundColor: '#4CAF50', // Green
  },
  closedIcon: {
    backgroundColor: '#F44336', // Red
  },
  appointmentIconText: {
    fontSize: 16,
    color: colors.white,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.8,
  },
  storeStatusText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  openText: {
    color: '#4CAF50', // Green
  },
  closedText: {
    color: '#F44336', // Red
  },
  nextOpeningContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 67, 54, 0.2)', // Light red border
  },
  nextOpeningText: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: '500',
  },
  nextOpeningTzText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
});

export default StoreStatusCard;
