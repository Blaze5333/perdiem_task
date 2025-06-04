/*eslint-disable*/
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/',
});

client.interceptors.request.use(config => {
  config.headers.set('Cache-Control', 'no-cache');
  config.headers.set('Pragma-Control', 'no-cache');
  config.headers.set('Content-Type', 'application/json');
  config.headers.set('Accept', 'application/json');
    config.headers.set('Access-Control-Allow-Origin', '*');

  return config;
});

export default client;
