/*eslint-disable*/
import apiClient from './client';
import moment from 'moment-timezone';

/**
 * Fetches regular store hours
 * 
 * Response format:
 * [
 *   {
 *     "id": string,
 *     "day_of_week": number (1-7 for Monday-Sunday),
 *     "is_open": boolean,
 *     "start_time": string (HH:MM format),
 *     "end_time": string (HH:MM format)
 *   },
 *   ...
 * ]
 * 
 * @returns {Promise<Array>} - Array of store hours
 */
export const fetchStoreHours = async () => {
  try {
    const response = await apiClient.get('/store-times');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching store hours:', error);
    throw error;
  }
};

/**
 * Fetches store hour overrides - special holidays or modified hours
 * 
 * Response format:
 * [
 *   {
 *     "id": string,
 *     "day": number (1-31),
 *     "month": number (1-12),
 *     "is_open": boolean,
 *     "start_time": string (HH:MM format),
 *     "end_time": string (HH:MM format)
 *   },
 *   ...
 * ]
 * 
 * Important: When is_open is false, the entire day is closed regardless of time.
 * The start_time and end_time values are not considered for closed days.
 * 
 * @returns {Promise<Array>} - Array of store overrides
 */
export const fetchStoreOverrides = async () => {
  try {
    const response = await apiClient.get('/store-overrides');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching store overrides:', error);
    throw error;
  }
};

/**
 * Fetch both store hours and overrides in a single call
 * @returns {Promise<Object>} - Object with storeHours and storeOverrides
 */
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
