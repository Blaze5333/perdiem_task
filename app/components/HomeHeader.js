/*eslint-disable*/
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';


const HomeHeader = ({ name, photo, onProfilePress }) => {
  const firstName = name ? name.split(' ')[0] : 'User';
  
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Welcome Back, {firstName}</Text>
      <TouchableOpacity 
        onPress={onProfilePress}
        style={styles.profileButton}
      >
        <Image 
          source={photo ? { uri: photo } : require('../assets/images/default-profile.png')} 
          style={styles.profileImage} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray900,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export default HomeHeader;
