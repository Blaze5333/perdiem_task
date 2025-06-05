/*eslint-disable  */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';


const NextOpeningCard = ({ nextOpening, onPressNotify, selectedTimezone }) => {
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
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 0,
  },
  contentContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  openingTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  timezoneName: {
    fontSize: 13,
    color: colors.gray500,
    fontWeight: '500',
  },
  notifyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  notifyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default NextOpeningCard;
