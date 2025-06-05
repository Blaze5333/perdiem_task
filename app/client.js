/*eslint-disable  */
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/',
});

client.interceptors.request.use(config => {
  config.headers.set('Content-Type', 'application/json');

  return config;
});

export default client;