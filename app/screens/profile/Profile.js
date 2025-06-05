/*eslint-disable */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { styles } from './ProfileStyle';
import { showAlert } from '../../utils/alert';
import { signOut } from '../../services/firebase/google-signin';
import { logout } from '../../redux/userSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const email = useSelector(state => state.user.email);
  const name = useSelector(state => state.user.name);
  const photo = useSelector(state => state.user.photo);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await signOut();
              dispatch(logout());
                navigation.navigate('Login');
            } catch (error) {
              showError(error, 'Failed to logout');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={
            photo
              ? {uri: photo}
              : require('../../assets/images/default-profile.png')
          }
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoading}>
        <Text style={styles.logoutText}>{isLoading ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;