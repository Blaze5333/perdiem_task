/*eslint-disable */

import { Alert } from "react-native";
import client from "../../client";

export const loginWithEmailPassword = async (email, password) => {
  try {
    // Make the API call to authenticate the user
   
   
    
    // Make the API call with explicit headers
    const response = await client.post('auth', 
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    
   
    
    // If successful (status 200), return the user data
    if (response.status === 200) {
     
      return {
        token: response.data.token || '',
      };
    }

    // If login failed, throw an error with the status
    Alert.alert(
      'Login Failed',
      response.data?.message || 'Login failed. Please try again.',
      [{ text: 'OK' }],
    );

  } catch (error) {
    
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 400:
          Alert.alert(
            'Login Failed',
            'Please check your email and password.',
            [{ text: 'OK' }],
          );
          break;
        case 401:
          Alert.alert(
            'Login Failed',
            'Invalid credentials. Please check your email and password.',
            [{ text: 'OK' }],
          );
          break;
        case 403:
          Alert.alert(
            'Login Failed',
            'Access denied. You may not have permission to log in.',
            [{ text: 'OK' }],
          );
          break;
        case 404:
          Alert.alert(
            'Login Failed',
            'Account not found. Please sign up or check your credentials.',
            [{ text: 'OK' }],
          );
          break;
        case 429:
          Alert.alert(
            'Login Failed',
            'Too many login attempts. Please try again later.',
            [{ text: 'OK' }],
          );
          break;
        case 500:
          Alert.alert(
            'Login Failed',
            'Server error. Please try again later.',
            [{ text: 'OK' }],
          );
          break
        default:
          Alert.alert(
            'Login Failed',
            error.response.data?.message || 'Login failed. Please try again.',
            [{ text: 'OK' }],
          );
      }
    } else if (error.request) {
      Alert.alert(
        'Login Failed',
        'Network error. Please check your connection and try again.',
        [{ text: 'OK' }],
      );
    } else {
      Alert.alert(
        'Login Failed',
        'Login process failed. Please try again later.',
        [{ text: 'OK' }],
      );
    }
  }
};

export default {
  loginWithEmailPassword,
};