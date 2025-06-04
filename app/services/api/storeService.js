/*eslint-disable*/
import apiClient from './client';
import moment from 'moment-timezone';


export const fetchStoreHours = async () => {
  try {
    const response = await apiClient.get('/store-times');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching store hours:', error);
    throw error;
  }
};


export const fetchStoreOverrides = async () => {
  try {
    const response = await apiClient.get('/store-overrides');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching store overrides:', error);
    throw error;
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
    console.error('Error fetching store data:', error);
    throw error;
  }
};
