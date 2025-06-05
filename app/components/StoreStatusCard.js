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
    backgroundColor: colors.white,
    borderWidth: 0,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  openIcon: {
    backgroundColor: colors.open,
  },
  closedIcon: {
    backgroundColor: colors.closed,
  },
  appointmentIconText: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '600',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  appointmentTime: {
    fontSize: 15,
    color: colors.gray700,
    fontWeight: '500',
    marginBottom: 8,
  },
  storeStatusText: {
    fontWeight: '700',
    marginTop: 4,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  openText: {
    color: colors.open,
  },
  closedText: {
    color: colors.closed,
  },
  nextOpeningContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  nextOpeningText: {
    fontSize: 15,
    color: colors.gray700,
    fontWeight: '600',
  },
  nextOpeningTzText: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default StoreStatusCard;
