/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { formatDate } from '../../utils/dateTimeUtils';


const DatePicker = ({ dates, selectedDate, onSelectDate, timezone }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const isSelected = selectedDate && 
            selectedDate.toDateString() === date.toDateString();
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedDateText
              ]}>
                {formatDate(date, timezone)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.gray900,
  },
  scrollContent: {
    paddingRight: 20,
  },
  dateItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 110,
    alignItems: 'center',
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray800,
  },
  selectedDateText: {
    color: colors.white,
  },
});

export default DatePicker;
