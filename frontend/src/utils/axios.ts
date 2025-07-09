import axios from 'axios';
import { API_URL, API_TIMEOUT } from '../config/config';


const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;