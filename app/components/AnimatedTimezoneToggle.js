import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

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
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
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
  toggleContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: colors.gray100,
    borderRadius: 25,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleBackground: {
    position: 'absolute',
    height: 46,
    width: '48%',
    top: 2,
    backgroundColor: colors.white,
    borderRadius: 23,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleOptionActive: {
    fontWeight: '700',
  },
  toggleOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray700,
    letterSpacing: -0.2,
  },
});

export default TimezoneToggle;
