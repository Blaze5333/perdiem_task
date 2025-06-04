/*eslint-disable*/
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StoreStatusIndicator from './StoreStatusIndicator';
import moment from 'moment-timezone';
import { colors } from '../constants/colors';

/**
 * Greeting and time card component
 */
const GreetingCard = ({ selectedTimezone, currentTime, isStoreOpen, loading }) => {
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
        <View style={styles.storeStatus}>
          <View style={[
            styles.statusDot,
            loading ? styles.loadingDot : (isStoreOpen ? styles.openIcon : styles.closedIcon)
          ]} />
          <Text style={styles.statusText}>
            {loading ? 'Checking...' : (isStoreOpen ? 'NYC Store Open' : 'NYC Store Closed')}
          </Text>
        </View>
      </View>
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
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: colors.gray600,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  loadingDot: {
    backgroundColor: colors.gray400,
  },
  openIcon: {
    backgroundColor: '#4CAF50', // Green
  },
  closedIcon: {
    backgroundColor: '#F44336', // Red
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray800,
  },
});

export default GreetingCard;
