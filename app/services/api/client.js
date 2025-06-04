/*eslint-disable*/
import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;
