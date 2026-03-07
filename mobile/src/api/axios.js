import axios from 'axios';
import { Platform } from 'react-native';

const rawBaseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const normalizedBaseURL = Platform.OS === 'android'
  ? rawBaseURL
      .replace('localhost', '10.0.2.2')
      .replace('127.0.0.1', '10.0.2.2')
  : rawBaseURL;

const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 15000
});

export const API_BASE_URL = normalizedBaseURL;

export default api;
