/*eslint-disable*/
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../constants/colors';

const TimezoneToggle = ({ selectedTimezone, onToggle, toggleAnim }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timezone</Text>
      <TouchableOpacity 
        style={styles.toggleContainer} 
        onPress={onToggle} 
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.toggleIndicator,
            {
              left: toggleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['2%', '52%']
              })
            }
          ]} 
        />
        <View style={styles.toggleOption}>
          <Text style={[
            styles.toggleText,
            selectedTimezone === 'NYC' && styles.selectedToggleText
          ]}>
            NYC
          </Text>
        </View>
        <View style={styles.toggleOption}>
          <Text style={[
            styles.toggleText,
            selectedTimezone === 'local' && styles.selectedToggleText
          ]}>
            Local
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.gray900,
  },
  toggleContainer: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: colors.gray100,
    borderRadius: 22,
    position: 'relative',
    width: 200,
  },
  toggleIndicator: {
    position: 'absolute',
    height: '90%',
    width: '48%',
    top: '5%',
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray600,
  },
  selectedToggleText: {
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TimezoneToggle;
