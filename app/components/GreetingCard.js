/*eslint-disable*/
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StoreStatusIndicator from './StoreStatusIndicator';
import moment from 'moment-timezone';
import { colors } from '../constants/colors';


const GreetingCard = ({ selectedTimezone, currentTime,  }) => {
  // Get greeting message based on time of day
  const getGreeting = () => {
    // Use moment to get the current time in the selected timezone
    const tz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    const now = moment().tz(tz);
    const hour = now.hour();
    let timeGreeting = '';
    
    if (hour >= 5 && hour <= 9) timeGreeting = 'Good Morning';
    else if (hour >= 10 && hour <= 11) timeGreeting = 'Late Morning Vibes!';
    else if (hour >= 12 && hour <= 16) timeGreeting = 'Good Afternoon';
    else if (hour >= 17 && hour <= 20) timeGreeting = 'Good Evening';
    else timeGreeting = 'Night Owl';
    
    const location = selectedTimezone === 'NYC' ? 'New York' : 'Local Time';
    return `${timeGreeting}, ${location}!`;
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleString('en-US', {
      timeZone: selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess(),
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.greetingHeader}>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.timeText}>{formatCurrentTime()}</Text>
        </View>
        
        {/* Current Store Status */}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  timeText: {
    fontSize: 16,
    color: colors.gray500,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  loadingDot: {
    backgroundColor: colors.warning,
  },
  openIcon: {
    backgroundColor: colors.open,
  },
  closedIcon: {
    backgroundColor: colors.closed,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray700,
  },
});

export default GreetingCard;
