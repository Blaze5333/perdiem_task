/*eslint-disable*/
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * Store status indicator component
 * Shows open/closed status with a green/red dot
 */
const StoreStatusIndicator = ({ isOpen }) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.statusDot,
        isOpen ? styles.openDot : styles.closedDot
      ]} />
      <Text style={[
        styles.statusText,
        isOpen ? styles.openText : styles.closedText
      ]}>
        {isOpen ? 'Open' : 'Closed'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  openDot: {
    backgroundColor: '#4CAF50', // Green
  },
  closedDot: {
    backgroundColor: '#F44336', // Red
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  openText: {
    color: '#4CAF50', // Green
  },
  closedText: {
    color: '#F44336', // Red
  },
});

export default StoreStatusIndicator;
