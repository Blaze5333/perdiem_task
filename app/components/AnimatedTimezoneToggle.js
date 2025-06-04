/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../constants/colors';


const { width } = Dimensions.get('window');

/**
 * Timezone toggle component with animation
 */
const TimezoneToggle = ({ 
  selectedTimezone, 
  setSelectedTimezone,
  toggleAnim 
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Timezone</Text>
      <View style={styles.toggleContainer}>
        <Animated.View 
          style={[
            styles.toggleBackground,
            {
              transform: [{
                translateX: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, (width - 64)/2]
                })
              }]
            }
          ]} 
        />
        <TouchableOpacity
          style={[
            styles.toggleOption,
            selectedTimezone === 'NYC' && styles.toggleOptionActive
          ]}
          onPress={() => setSelectedTimezone('NYC')}
          activeOpacity={0.8}
        >
          <Text style={styles.toggleOptionText}>📍 NYC Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            selectedTimezone === 'LOCAL' && styles.toggleOptionActive
          ]}
          onPress={() => setSelectedTimezone('LOCAL')}
          activeOpacity={0.8}
        >
          <Text style={styles.toggleOptionText}>📍 Local Time</Text>
        </TouchableOpacity>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: colors.gray100,
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleBackground: {
    position: 'absolute',
    height: 40,
    width: '48%',
    top: 2,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleOptionActive: {
    fontWeight: 'bold',
  },
  toggleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray800,
  },
});

export default TimezoneToggle;
