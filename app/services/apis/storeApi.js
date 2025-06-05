/*eslint-disable*/
import client from '../../client';

/**
 * Fetch regular store operating hours
 * @returns {Promise<Array>} Array of store hours by day of week
 */
export const fetchStoreHours = async () => {
  try {
    const response = await client.get('/store-times');
    return response.data;
  } catch (error) {
    console.error('Error fetching store hours:', error);
    throw new Error('Failed to fetch store hours');
  }
};

/**
 * Fetch store hour overrides for special dates
 * @returns {Promise<Array>} Array of store hour overrides
 */
export const fetchStoreOverrides = async () => {
  try {
    const response = await client.get('/store-overrides');
    console.log('Store overrides fetched:', response.data.length)
    return response.data;
  } catch (error) {
    console.error('Error fetching store overrides:', error);
    throw new Error('Failed to fetch store hour overrides');
  }
};

export default {
  fetchStoreHours,
  fetchStoreOverrides,
};
