/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import StoreStatusIndicator from '../StoreStatusIndicator';
import { 
  generateDates, 
  generateTimeSlots, 
  isStoreOpen 
} from '../../utils/dateTimeUtils';
import { 
  fetchStoreHours, 
  fetchStoreOverrides 
} from '../../services/apis/storeApi';

/**
 * Schedule selector container component
 * Handles the logic for date and time selection and store hours
 */
const ScheduleSelector = ({ selectedTimezone, onScheduleSelected }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [storeOpen, setStoreOpen] = useState(false);
  const [storeHours, setStoreHours] = useState([]);
  const [storeOverrides, setStoreOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch store hours data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hours, overrides] = await Promise.all([
          fetchStoreHours(),
          fetchStoreOverrides()
        ]);
        
        setStoreHours(hours);
        setStoreOverrides(overrides);
        setError(null);
      } catch (err) {
        setError('Failed to load store hours. Please try again.');
        console.error('Error loading store data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Generate dates when timezone changes
  useEffect(() => {
    const newDates = generateDates(30, selectedTimezone);
    setDates(newDates);
    
    // Reset selections when timezone changes
    setSelectedDate(null);
    setSelectedTime(null);
    setTimeSlots([]);
  }, [selectedTimezone]);

  // Generate time slots when date changes
  useEffect(() => {
    if (selectedDate && storeHours.length > 0) {
      const slots = generateTimeSlots(
        selectedDate,
        selectedTimezone,
        storeHours,
        storeOverrides
      );
      setTimeSlots(slots);
      
      // Reset selected time when date changes
      setSelectedTime(null);
    }
  }, [selectedDate, selectedTimezone, storeHours, storeOverrides]);

  // Check if store is open when time is selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const open = isStoreOpen(
        selectedDate,
        selectedTime,
        selectedTimezone,
        storeHours,
        storeOverrides
      );
      setStoreOpen(open);
      
      // Notify parent component of selection
      onScheduleSelected({
        date: selectedDate,
        time: selectedTime,
        isOpen: open
      });
    }
  }, [selectedDate, selectedTime, selectedTimezone, storeHours, storeOverrides]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelect = (time, dateTime) => {
    setSelectedTime(time);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading store hours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DatePicker
        dates={dates}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        timezone={selectedTimezone}
      />
      
      {selectedDate && (
        <TimePicker
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          onSelectTime={handleTimeSelect}
        />
      )}
      
      {selectedDate && selectedTime && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Store status:</Text>
          <StoreStatusIndicator isOpen={storeOpen} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  loadingText: {
    color: colors.gray600,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  statusContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray800,
    marginRight: 10,
  },
});

export default ScheduleSelector;
