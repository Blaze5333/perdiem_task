/*eslint-disable*/
import { Alert } from 'react-native';
import client from '../../client';

export const fetchStoreHours = async () => {
  try {
    const response = await client.get('/store-times');
    if (response.status !== 200) {
      Alert.alert(
        'Error Fetching Store Hours',
        'There was an issue retrieving the store hours. Please try again later.',
        [{ text: 'OK' }]
      );
      return [];
    }
    return response.data || [];
  } catch (error) {
   Alert.alert(
      'Error Fetching Store Hours',
      'There was an issue retrieving the store hours. Please try again later.',
      [{ text: 'OK' }]
    );
    return [];
  }
};


export const fetchStoreOverrides = async () => {
  try {
    const response = await client.get('/store-overrides');
    if (response.status !== 200) {
      Alert.alert(
        'Error Fetching Store Overrides',
        'There was an issue retrieving the store overrides. Please try again later.',
        [{ text: 'OK' }]
      );
      return [];
    }
    return response.data || [];
  } catch (error) {
    Alert.alert(
      'Error Fetching Store Overrides',
      'There was an issue retrieving the store overrides. Please try again later.',
      [{ text: 'OK' }]
    );
    return [];
  }
};


export const fetchAllStoreData = async () => {
  try {
    const [hoursResponse, overridesResponse] = await Promise.all([
      fetchStoreHours(),
      fetchStoreOverrides()
    ]);
    
    return {
      storeHours: hoursResponse,
      storeOverrides: overridesResponse
    };
  } catch (error) {
    Alert.alert(
      'Error Fetching Store Data',
      'There was an issue retrieving the store data. Please try again later.',
      [{ text: 'OK' }]
    );
  }
};
