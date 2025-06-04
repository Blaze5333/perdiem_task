/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { homeStyles } from './homeStyle';
import { colors } from '../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Color palette


const animationConfig = {
  spring: {
    tension: 100,
    friction: 8,
  },
};

const HomeScreen = ({ onLogout }) => {
  const [selectedTimezone, setSelectedTimezone] = useState('NYC');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [storeStatus, setStoreStatus] = useState('open');
  const [currentTime, setCurrentTime] = useState(new Date());
 const email=useSelector((state) => state.user.email);
 const name=useSelector((state) => state.user.name);
  const photo=useSelector((state) => state.user.photo);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  // Mock store hours
  const storeHours = {
    monday: [{ open: '09:00', close: '18:00' }],
    tuesday: [{ open: '09:00', close: '18:00' }],
    wednesday: [{ open: '09:00', close: '18:00' }],
    thursday: [{ open: '09:00', close: '18:00' }],
    friday: [{ open: '09:00', close: '20:00' }],
    saturday: [{ open: '10:00', close: '20:00' }],
    sunday: [{ open: '11:00', close: '17:00' }]
  };

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Timezone toggle animation
  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: selectedTimezone === 'NYC' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedTimezone]);

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = (date) => {
    if (!date) return [];
    
    const slots = [];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayHours = storeHours[dayName] || [];
    
    dayHours.forEach(period => {
      const [openHour, openMin] = period.open.split(':').map(Number);
      const [closeHour, closeMin] = period.close.split(':').map(Number);
      
      let currentSlot = new Date(date);
      currentSlot.setHours(openHour, openMin, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(closeHour, closeMin, 0, 0);
      
      while (currentSlot < endTime) {
        slots.push(new Date(currentSlot));
        currentSlot.setMinutes(currentSlot.getMinutes() + 15);
      }
    });
    
    return slots;
  };

  // Get greeting message
  const getGreeting = () => {
    const hour = currentTime.getHours();
    let timeGreeting = '';
    
    if (hour >= 5 && hour <= 9) timeGreeting = 'Good Morning';
    else if (hour >= 10 && hour <= 11) timeGreeting = 'Late Morning Vibes!';
    else if (hour >= 12 && hour <= 16) timeGreeting = 'Good Afternoon';
    else if (hour >= 17 && hour <= 20) timeGreeting = 'Good Evening';
    else timeGreeting = 'Night Owl';
    
    const location = selectedTimezone === 'NYC' ? 'NYC' : 'Kolkata';
    return `${timeGreeting}, ${location}!`;
  };

  // Show modal with animation
  const showModal = (modalType) => {
    if (modalType === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        ...animationConfig.spring,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hide modal with animation
  const hideModal = (modalType) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (modalType === 'date') {
        setShowDatePicker(false);
      } else {
        setShowTimePicker(false);
      }
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
    });
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Welcome Back,{name.split(" ")[0]}</Text>
        <TouchableOpacity 
          onPress={()=>{
            navigation.navigate('Profile');
          }}
          style={homeStyles.logoutButton}
        >
         <Image source={photo ? { uri: photo } : require('../../assets/images/default-profile.png')} style={homeStyles.profileImage} />
        </TouchableOpacity>
      </View>

      <ScrollView style={homeStyles.homeContent} showsVerticalScrollIndicator={false}>
        {/* Timezone Toggle */}
        <View style={homeStyles.card}>
          <Text style={homeStyles.cardTitle}>Timezone</Text>
          <View style={homeStyles.toggleContainer}>
            <Animated.View 
              style={[
                homeStyles.toggleBackground,
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
                homeStyles.toggleOption,
                selectedTimezone === 'NYC' && homeStyles.toggleOptionActive
              ]}
              onPress={() => setSelectedTimezone('NYC')}
              activeOpacity={0.8}
            >
              <Text style={homeStyles.toggleOptionText}>📍 NYC Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                homeStyles.toggleOption,
                selectedTimezone === 'LOCAL' && homeStyles.toggleOptionActive
              ]}
              onPress={() => setSelectedTimezone('LOCAL')}
              activeOpacity={0.8}
            >
              <Text style={homeStyles.toggleOptionText}>📍 Local Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting & Store Status */}
        <View style={homeStyles.card}>
          <View style={homeStyles.greetingHeader}>
            <View style={homeStyles.greetingContent}>
              <Text style={homeStyles.greetingText}>{getGreeting()}</Text>
              <Text style={homeStyles.timeText}>
                {currentTime.toLocaleString('en-US', {
                  timeZone: selectedTimezone === 'NYC' ? 'America/New_York' : 'Asia/Kolkata',
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <View style={homeStyles.storeStatus}>
              <View style={[
                homeStyles.statusDot,
                { backgroundColor: storeStatus === 'open' ? colors.success : colors.error }
              ]} />
              <Text style={homeStyles.statusText}>
                {storeStatus === 'open' ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Appointment */}
        {selectedDate && selectedTime && (
          <Animated.View 
            style={[homeStyles.appointmentCard]}
            entering="fadeInUp"
          >
            <View style={homeStyles.appointmentContent}>
              <View style={homeStyles.appointmentIcon}>
                <Text style={homeStyles.appointmentIconText}>✓</Text>
              </View>
              <View style={homeStyles.appointmentDetails}>
                <Text style={homeStyles.appointmentTitle}>Appointment Booked</Text>
                <Text style={homeStyles.appointmentTime}>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })} at {selectedTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Date Selection */}
        <View style={homeStyles.card}>
          <Text style={homeStyles.cardTitle}>Select Date & Time</Text>
          <TouchableOpacity
            style={homeStyles.dateButton}
            onPress={() => showModal('date')}
            activeOpacity={0.8}
          >
            <View style={homeStyles.dateButtonContent}>
              <Text style={homeStyles.dateButtonIcon}>📅</Text>
              <Text style={homeStyles.dateButtonText}>
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'Choose a date'
                }
              </Text>
            </View>
            <Text style={homeStyles.dateButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="none"
        onRequestClose={() => hideModal('date')}
      >
        <Animated.View 
          style={[
            homeStyles.modalOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={homeStyles.modalOverlay}
            onPress={() => hideModal('date')}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              homeStyles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={homeStyles.modalHeader}>
              <Text style={homeStyles.modalTitle}>Select Date</Text>
              <TouchableOpacity 
                onPress={() => hideModal('date')}
                style={homeStyles.closeButton}
              >
                <Text style={homeStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={homeStyles.modalScroll}>
              {generateDates().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={homeStyles.dateItem}
                  onPress={() => {
                    setSelectedDate(date);
                    hideModal('date');
                    setTimeout(() => showModal('time'), 300);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={homeStyles.dateItemContent}>
                    <Text style={homeStyles.dateItemText}>
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={homeStyles.dateItemLabel}>
                      {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : ''}
                    </Text>
                  </View>
                  <Text style={homeStyles.dateItemArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="none"
        onRequestClose={() => hideModal('time')}
      >
        <Animated.View 
          style={[
            homeStyles.modalOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity 
            style={homeStyles.modalOverlay}
            onPress={() => hideModal('time')}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              homeStyles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={homeStyles.modalHeader}>
              <Text style={homeStyles.modalTitle}>Available Time Slots</Text>
              <TouchableOpacity 
                onPress={() => hideModal('time')}
                style={homeStyles.closeButton}
              >
                <Text style={homeStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedDate && (
              <Text style={homeStyles.selectedDateText}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            )}
            <ScrollView style={homeStyles.modalScroll}>
              <View style={homeStyles.timeSlotGrid}>
                {generateTimeSlots(selectedDate).map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={homeStyles.timeSlot}
                    onPress={() => {
                      setSelectedTime(time);
                      hideModal('time');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={homeStyles.timeSlotText}>
                      {time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;